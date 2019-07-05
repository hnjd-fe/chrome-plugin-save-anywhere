
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import store from '@src/store';
import router from './router';
import routes from './routes.js';
import databaseInfo from '@src/components/databaseInfo.vue'

router.addRoutes(routes);

Vue.use(ElementUI)
Vue.component( 'databaseInfo', databaseInfo)

Vue.use(VueAxios, axios)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount( '#app' );
