
import VueI18n from 'vue-i18n'
import deepmerge from 'deepmerge'

// 准备翻译的语言环境信息
const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  zh: {
    message: {
      hello: '你好，世界'
    }
  }
}

function fixLocale( lang ){
    lang['zh-CN'] = lang['zh']
    lang['en-US'] = lang['en']
}


export default {
    init( locale = zh, page = 'index' ) {
        let json = require( `./pages/${page}/index.js` );
        let merged = deepmerge( messages, json );
        fixLocale( merged );

        const i18n = new VueI18n({
            locale: locale, // 设置地区
            messages: merged, // 设置地区信息
        })

        return i18n;
    }

    , getLocale(){
		let locale = localStorage.getItem( 'locale' ) || navigator.language.replace( /\-.*/, '' );
		return locale;
    }

    , supportLang: {
        'zh': '中文'
        , 'en': 'English'
    }
};
