
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import i18nConfig from '@src/i18n/i18n.js'

import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import localeEn from 'element-ui/lib/locale/lang/en'
import App from './App.vue'
import store from '@src/store';
import router from './router';
import routes from './routes.js';
import databaseInfo from '@src/components/databaseInfo.vue'

import globalVar from '@src/globalVar.js';

router.addRoutes(routes);

Vue.prototype.globalVar = globalVar;

Vue.use( VueI18n );

let eleSetting = {}

if( i18nConfig.getLocale() == 'en' ){
	eleSetting.locale = localeEn;
}

Vue.use(ElementUI, eleSetting )
Vue.component( 'databaseInfo', databaseInfo)

Vue.use(VueAxios, axios)


new Vue({
	i18n: i18nConfig.init( i18nConfig.getLocale(), 'index' ),
    router,
    store,
    render: h => h(App)
}).$mount( '#app' );
