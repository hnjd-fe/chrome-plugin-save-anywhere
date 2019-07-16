
import VueI18n from 'vue-i18n'
import deepmerge from 'deepmerge'

// 准备翻译的语言环境信息
const messages = {
	en: {
        "mainPage": "save-anywhere",
        "importExport": "import/export",
        "dataManage": "data manage",
        "popupPage": "popup page",
        "setting": "setting"

		, "searchPlaceholder": "search text"
		, "nodata": "nothing in there"
        , "synchronous_short": "sync"
	},
	zh: {
        "mainPage": "save-anywhere",
        "importExport": "导入/导出",
        "dataManage": "数据管理",
        "popupPage": "popup 页面",
        "setting": "设置"

		, "searchPlaceholder": "请输入内容"
		, "nodata": "暂无数据"
	}
}

function fixLocale( lang ){
	let zh = clone( lang.zh ), en = clone( lang.en );
	lang.en = deepmerge( zh, lang.en );
	lang.zh  = deepmerge( en, lang.zh );

    lang['zh-CN'] = lang['zh']
    lang['en-US'] = lang['en']
}

function clone( item ){
	return JSON.parse( JSON.stringify( item ) )
}

export default {
    supportLang: {
        'zh': '中文'
        , 'en': 'English'
    }
    , init( locale = zh, page = 'index' ) {
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

	, updateLocale( lang ) {
		localStorage.setItem( 'locale', lang );
		return lang;
	}
};
