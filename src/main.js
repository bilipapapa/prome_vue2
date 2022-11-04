import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/main.scss'
import dialogBox from './components/dialogBox/index'

Vue.config.productionTip = false

Vue.use(dialogBox)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
