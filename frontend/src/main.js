import Vue from 'vue';
import App from './App.vue';

import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import SequentialEntrance from 'vue-sequential-entrance';
import 'vue-sequential-entrance/vue-sequential-entrance.css';
import VueScreenSize from 'vue-screen-size';

import '@fortawesome/fontawesome-free/css/all.css';
import './index.css';

const socketConnection = SocketIO('https://fathomless-citadel-13208.herokuapp.com/');
Vue.use(new VueSocketIO({
  debug: true,
  connection: socketConnection
}));

Vue.use(SequentialEntrance);
Vue.use(VueScreenSize);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
