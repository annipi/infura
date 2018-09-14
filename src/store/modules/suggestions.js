import Vue from 'vue'
import Blob from 'blob'
import * as constants from '@/store/constants'
import SuggestionContract from '@/contracts/Suggestion.json'

const state = {
  provider: !!(window.web3 && window.web3.currentProvider),
  isOwner: false,
  contract: null,
  coinbase: null,
  hash: null,
  events: null,
  user: null,
  file: null
}

const actions = {
  [constants.SUGGESTIONS_INIT]: ({commit, dispatch}) => {
    const abi = SuggestionContract.abi
    // Ropsten contact address
    const contractAddress = '0x11589f14727997Df90f7668f4f095AAC0fA645FE'

    // Local contract address. Depends on Ganache.
    // const contractAddress = '0xf84d35eb7a124e7821aae2e0a8d61707794e9cea'
    const contract = web3.eth.contract(abi).at(contractAddress)
    commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'contract', value: contract})
    web3.eth.getCoinbase((error, coinbase) => {
      if (!error) {
        commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'coinbase', value: coinbase})
        contract.isOwner({from: coinbase}, (error, result) => {
          if (error) console.error(error)
          commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'isOwner', value: result})
        })
        contract.getHash({from: coinbase}, (error, hash) => {
          if (error) console.error(error)
          commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'hash', value: hash})
          dispatch(constants.SUGGESTIONS_GET_FILE, hash)
        })
      }
    })
  },
  [constants.SUGGESTIONS_ADD_USER_SUGGESTION]: ({commit, state}, data) => {
    state.contract.addSuggestion(
      data.name,
      data.hash,
      {from: state.coinbase},
      (error, result) => {
        if (!error) console.log(result)
      }
    )
  },
  [constants.SUGGESTIONS_GET_HASH]: ({commit, state}) => {
    state.contract.getHash(
      {from: state.coinbase},
      (error, result) => {
        if (!error) commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'hash', value: result})
      }
    )
  },
  [constants.SUGGESTIONS_GET_EVENTS]: ({commit, state}) => {
    const event = state.contract.suggestionAdded({}, {fromBlock: 0, toBlock: 'latest'})
    let events = []
    event.get((error, logs) => {
      logs.forEach(l => {events.push(l.args)})
    })
    commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'events', value: events})
  },
  [constants.SUGGESTIONS_GET_BY_ADDRESS]: ({commit, state}, address) => {
    state.contract.getSuggestionByAddress(
      address,
      {from: state.coinbase},
      (error, result) => {
        if (error) console.error(error)
        commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'user', value: result})
      }
    )
  },
  [constants.SUGGESTIONS_UPLOAD_FILE]: ({commit, dispatch}, data) => {
    const {file, name} = data
    let formData = new FormData()
    formData.append('file', file)
    Vue.axios.post('add?pin=false', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(response => response.data)
      .then(result => {
        console.log(result)
        dispatch(constants.SUGGESTIONS_ADD_USER_SUGGESTION, {name, hash: result.Hash})
      })
  },
  [constants.SUGGESTIONS_GET_FILE]: ({commit, state}, hash) => {
    Vue.axios.get(`cat?arg=${hash}`, {responseType: 'arraybuffer'})
      .then(response => response.data)
      .then(file => {
        const blob = new Blob([file], {type: 'application/pdf'})
        const url = window.URL.createObjectURL(blob)
        window.open(url)
        commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'file', value: blob})
      })
  }
}

const mutations = {
  [constants.SUGGESTIONS_SET_PROPERTY]: (state, data) => {
    state[data.property] = data.value
  }
}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}