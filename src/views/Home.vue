<template>
  <div class="container">
    <h1>IPFS PDF uploader</h1>
    <div class="alert alert-danger" role="alert" v-if="!isProviderDetected">
      A simple danger alert—check it out!
    </div>
    <div class="alert alert-warning" role="alert" v-if="!isLoggedIn">
      A simple warning alert—check it out!
    </div>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="name">Your name</label>
        <input type="text" class="form-control" id="name" placeholder="Enter email" v-model="form.name">
      </div>
      <div class="form-group">
        <label for="hash">Hash</label>
        <input type="text" class="form-control" id="hash" placeholder="GUACHUGUACHU" v-model="form.hash">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <ul v-if="isOwner">
      <li v-for="event in events">Address: <button class="btn btn-link" @click="getUser(event.user)">{{event.user}}</button> - Hash: {{event.hash}}</li>
    </ul>
    <div class="alert alert-secondary" role="alert" v-if="user">
      {{user[0]}} {{user[1]}}
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import * as constants from '@/store/constants'

  export default {
    name: 'home',
    data () {
      return {
        form: {
          name: null,
          hash: null
        }
      }
    },
    computed: {
      ...mapState({
        isProviderDetected: state => state.Suggestions.provider,
        isOwner: state => state.Suggestions.isOwner,
        isLoggedIn: state => !!state.Suggestions.coinbase,
        events: state => state.Suggestions.events,
        user: state => state.Suggestions.user
      })
    },
    methods: {
      ...mapActions({
        init: constants.SUGGESTIONS_INIT,
        addUserSuggestion: constants.SUGGESTIONS_ADD_USER_SUGGESTION,
        getEvents: constants.SUGGESTIONS_GET_EVENTS,
        getUser: constants.SUGGESTIONS_GET_BY_ADDRESS
      }),
      submit () {
        this.addUserSuggestion(this.form)
      }
    },
    mounted () {
      this.init()
      this.getEvents()
    }
  }
</script>
