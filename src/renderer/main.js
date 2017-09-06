import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App'
import router from './router'
import store from './store'
import Storage from './services/Storage'
import Repo from './services/Repo'
import Formatter from './services/Formatter'

Vue.config.productionTip = false
Vue.use(Vuetify)

Vue.storage = Vue.prototype.$storage = new Storage()
Vue.repo = Vue.prototype.$repo = new Repo(Vue.storage)
Vue.formatter = Vue.prototype.$format = new Formatter(Vue.repo)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
