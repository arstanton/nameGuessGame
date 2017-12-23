// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueSocketio from 'vue-socket.io';

Vue.config.productionTip = process.env.NODE_ENV === 'production';

Vue.use(VueSocketio,  process.env.SOCKET_SERVER_URI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
