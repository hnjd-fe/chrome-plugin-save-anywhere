
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import store from '@src/store';

Vue.use(ElementUI)

Vue.use(VueAxios, axios)

new Vue({
  store,
  render: h => h(App)
}).$mount( '#app' );
