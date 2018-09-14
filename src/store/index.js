import Vue from 'vue'
import Vuex from 'vuex'
import Suggestions from './modules/suggestions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Suggestions
  }
})
