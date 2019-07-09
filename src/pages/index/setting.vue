<template>
<el-container>
    <el-main>
		<el-form ref="form" :model="form" label-width="120px">
			<el-form-item label="选择语言:">
				<el-select v-model="form.lang" placeholder="请选择">
					<el-option
						v-for="(item,key) in langs"
						:key="key"
						:label="item"
						:value="key">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="开发者模式:">
				<el-checkbox 
					label="显示开发者功能" 
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
	}
	, mounted() {
	}
	, created() {
		this.form.devMode = this.globalVar.devMode;
	}
};
</script>
