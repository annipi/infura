<template>
  <div class="container">
    <h1>IPFS PDF uploader</h1>
    <div class="alert alert-danger" role="alert" v-if="!isProviderDetected">
      We couldn't detect a valid web3 provider. Think on <a href="https://metamask.io/" target="_blank">MetaMask</a>.
    </div>
    <div class="alert alert-warning" role="alert" v-else-if="!isLoggedIn">
      You must use your Ropsten account to interact with this site
    </div>
    <div v-else>
      <form @submit.prevent="submit" autocomplete="off">
        <div class="form-group">
          <label for="name">Your name</label>
          <input type="text" class="form-control" id="name" placeholder="Enter email" v-model="form.name" required>
        </div>
        <div class="custom-file">
          <input type="file" class="custom-file-input" id="file" placeholder="Select file or just drop it here."
                 @change="upload" required accept="application/pdf">
          <label class="custom-file-label" for="file">Choose file</label>
        </div>
        <br>
        <br>
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>
      <ul v-if="isOwner">
        <li v-for="event in events">Address:
          <button class="btn btn-link" @click="getUser(event.user)">{{event.user}}</button>
          - Hash: {{event.hash}}
        </li>
      </ul>
      <div class="alert alert-secondary" role="alert" v-if="user">
        {{user[0]}} {{user[1]}}
      </div>
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
          file: null
        }
      }
    },
    computed: {
      ...mapState({
        isProviderDetected: state => state.Suggestions.provider,
        isOwner: state => state.Suggestions.isOwner,
        isLoggedIn: state => !!state.Suggestions.coinbase,
        events: state => state.Suggestions.events,
        user: state => state.Suggestions.user,
        file: state => state.Suggestions.file
      })
    },
    methods: {
      ...mapActions({
        init: constants.SUGGESTIONS_INIT,
        addUserSuggestion: constants.SUGGESTIONS_UPLOAD_FILE,
        getEvents: constants.SUGGESTIONS_GET_EVENTS,
        getUser: constants.SUGGESTIONS_GET_BY_ADDRESS
      }),
      upload (e) {
        const files = e.target.files
        if (!files.length) {
          return
        }
        this.form.file = files[0]
      },
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
