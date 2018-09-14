import * as constants from '@/store/constants'
import SuggestionContract from '@/contracts/Suggestion.json'

const state = {
  provider: !!(window.web3 && window.web3.currentProvider),
  isOwner: false,
  contract: null,
  coinbase: null,
  hash: null,
  events: null,
  user: null
}

const actions = {
  [constants.SUGGESTIONS_INIT]: ({commit}) => {
    const abi = SuggestionContract.abi
    const contractAddress = '0xfdd147d46d7ae3a4b9ec102acec381e53f6d4b95'
    const contract = web3.eth.contract(abi).at(contractAddress)
    commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'contract', value: contract})
    web3.eth.getCoinbase((error, coinbase) => {
      if (!error) {
        commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'coinbase', value: coinbase})
        contract.isOwner({from: coinbase}, (error, result) => {
          if (error) console.error(error)
          commit(constants.SUGGESTIONS_SET_PROPERTY, {property: 'isOwner', value: result})
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