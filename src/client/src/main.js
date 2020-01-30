import Vue from 'vue'
import App from './App.vue'
import {router} from './routes/index.js'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'

// import openSocket from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '../plugins/socketPlugin';

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faUserSecret)


// export const SocketInstance = openSocket('http://localhost:3000')
// Vue.use(VueSocketIO, SocketInstance)

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.prototype.$http = axios;

new Vue({
	render: h => h(App),
	router,
}).$mount('#app')
