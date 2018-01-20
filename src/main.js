// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueSocketio from 'vue-socket.io';
import VueRouter from 'vue-router';

Vue.config.productionTip = process.env.NODE_ENV === 'production';

Vue.use(VueSocketio,  process.env.SOCKET_SERVER_URI);
Vue.use(VueRouter);

const routes = [
  { path: '/:key', component: App },
];

const router = new VueRouter({
  routes,
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
});