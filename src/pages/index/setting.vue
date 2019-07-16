<template>
<el-container>
    <el-main>
		<el-form ref="form" :model="form" label-width="120px">

			<el-form-item :label="$t('login')" v-if="!token">
                <el-button type="primary" style="width:180px;" id="login">
                    {{$t('login_github')}}<i class="el-icon-user-solid el-icon--right"></i></el-button>
			</el-form-item>

			<el-form-item :label="$t('logout')" v-if="token">
                <el-button type="primary" style="" id="logout">
                    {{$t('logout')}} {{nickname}}@{{logintype}}<i class="el-icon-user-solid el-icon--right"></i></el-button>
			</el-form-item>


			<el-form-item :label="$t('language')">
				<el-select v-model="form.lang" 
					@change="localeChange"
					>
					<el-option
						v-for="(item,key) in langs"
						:key="key"
						:label="item"
						:value="key">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item :label="$t('devmode')">
				<el-checkbox 
					:label="$t('devmodeDesc')" 
                    v-model="form.devMode"
					@change="devModeChange"
				></el-checkbox>
			</el-form-item>
		</el-form>

    </el-main>
</el-container>
</template>

<style>
.el-row {
}
</style>

<script>

import config from '@src/chrome/config.js'
import db from '@src/chrome/db.js'
import dataMixin from '@src/mixin/data.js'
import i18nConfig from '@src/i18n/i18n.js'

import locale from 'element-ui/lib/locale'
import langEn from 'element-ui/lib/locale/lang/en'
import langZh from 'element-ui/lib/locale/lang/zh-CN'

const packInfo = require( '@root/package.json' )

export default {
	mixins: [ dataMixin ]
	, data() {
		return {
			form: {
				devMode: this.globalVar.devMode
				, lang: i18nConfig.getLocale()
			}
			, langs: i18nConfig.supportLang
		}
	}
	, computed: {
	}
	, methods: {
		devModeChange( val ) {
			this.globalVar.updateDevMode( val, this )
		}
		, localeChange( val ) {
			i18nConfig.updateLocale( val );
			//console.log( this.$i18n );
			this.$i18n.locale = val;

			switch( val ){
				case 'en': {
					locale.use( langEn )
					break;
				}
				default: {
					locale.use( langZh )
					break;
				}
			}
		}
	}
	, mounted() {
        this.initLogin();
	}
	, created() {
		this.form.devMode = this.globalVar.devMode;
	}
};
</script>
