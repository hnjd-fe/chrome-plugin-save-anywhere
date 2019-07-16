
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import i18nConfig from '@src/i18n/i18n.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import store from '@src/store';

import router from './router';
import routes from './routes.js';

require( '@src/chrome/chrome_login.js');

router.addRoutes(routes);

Vue.use( VueI18n );

Vue.use(ElementUI)

Vue.use(VueAxios, axios)

new Vue({
    i18n: i18nConfig.init( i18nConfig.getLocale(), 'popup' ),
    router,
    store,
    render: h => h(App)
}).$mount( '#app' );
