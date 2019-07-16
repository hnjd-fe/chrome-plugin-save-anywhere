<template>
<el-container>
    <el-main>
        <el-row>
            <databaseInfo ref="databaseInfo"></databaseInfo>
        </el-row>
        <el-row>
            <el-button type="primary" style="width:180px;" id="login" v-if="!token">
                {{$t('login_github')}}<i class="el-icon-user-solid el-icon--right"></i></el-button>
        </el-row>
        </el-row>
    </el-main>
</el-container>
</template>

<style>
.el-row {
    margin: 20px auto;
}
</style>

<script>
import Vue from 'vue'
import config from '@src/chrome/config.js'
import db from '@src/chrome/db.js'
import dataMixin from '@src/mixin/data.js'

const packInfo = require( '@root/package.json' )

export default {
    mixins: [ dataMixin ]
    , data() {
        return {
        }
    }
    , methods: {
    }
    , mounted(){
        this.initLogin();
    }
}
</script>
