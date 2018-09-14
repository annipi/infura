import Vue from 'vue'
import App from './App.vue'
import Web3 from 'web3'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router/index'
import store from './store/index'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = 'https://ipfs.infura.io:5001/api/v0'

addEventListener('load', () => {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
    console.info('Metamask has been detected')
  } else {
    console.warn('I have not detected the metamask plugin')
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
