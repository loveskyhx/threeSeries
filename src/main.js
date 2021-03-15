import Vue from 'vue';
import ElementUI from 'element-ui';

import VueRouter from 'vue-router';
import routeConfig from './router-config';

import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false

//定义路由
const router = new VueRouter({
    routes: routeConfig
})
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
