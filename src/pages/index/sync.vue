<template>
<el-container>
    <el-main>
        <el-row>
            <databaseInfo ref="databaseInfo"></databaseInfo>
        </el-row>
        <el-row>
            <el-button type="primary" @click="login" style="width:180px;">
                {{$t('login_github')}}<i class="el-icon-user-solid el-icon--right"></i></el-button>
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
        login() {
            let backUrl = encodeURIComponent( location.href );
            let oauth = `http://btbtd.org/api/saveanywhere?backurl=${backUrl}&logintype=github`

            console.log( oauth );
            location.href = oauth;
        }
    }
    , mounted(){

    }
}
</script>
