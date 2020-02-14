import Vue from 'vue'
import App from './App.vue'
import {router} from './routes/index.js'
import axios from 'axios'
import { BootstrapVue, IconsPlugin, BModal, VBModal } from 'bootstrap-vue'
import win98 from 'windows_98.css'
import Store from './store.js'
// import openSocket from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faUserPlus, faPlusSquare, faUsers, faPencilAlt, faComment, faCheck} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import '../plugins/socketPlugin';

import Toasted from 'vue-toasted';

Vue.component('font-awesome-icon', FontAwesomeIcon);

library.add(faUserSecret);
library.add(faUserPlus);
library.add(faPlusSquare);
library.add(faUsers);
library.add(faPencilAlt);
library.add(faComment);
library.add(faCheck);

// export const SocketInstance = openSocket('http://localhost:3000')
// Vue.use(VueSocketIO, SocketInstance)
Vue.use(win98);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Toasted,{
	iconPack : 'fontawesome'
});

Vue.component('b-modal', BModal);
Vue.directive('b-modal', VBModal);


Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
	render: h => h(App),
	router,
	store:Store
}).$mount('#app');

