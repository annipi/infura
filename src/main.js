import Vue from 'vue'
import App from './App.vue'
import Web3 from 'web3'
import router from './router/index'
import store from './store/index'

Vue.config.productionTip = false

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
