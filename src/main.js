import Vue from 'vue'
import App from './App.vue'

import router from './router/router'
import store from './store/store'

Vue.use(require('vue-moment'))

require('./assets/css/reset.css')
require('./assets/css/common.css')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
