<template>
<el-container>
    <el-main>
		<el-form ref="form" :model="form" label-width="120px">
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

const packInfo = require( '@root/package.json' )

export default {
	mixins: [ dataMixin ]
	, data() {
		return {
			form: {
				devMode: this.globalVar.devMode
			}
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
