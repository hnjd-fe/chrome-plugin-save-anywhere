<template>
<el-container>
    <el-main>
        <el-row>
            <databaseInfo ref="databaseInfo"></databaseInfo>
        </el-row>
        <el-row>
            <el-button type="primary" @click="login" style="width:180px;">
                {{$t('login_github')}}<i class="el-icon-user-solid el-icon--right"></i></el-button>

                <br />
                <iframe :src="iframeUrl" width="80%" height="500" @load="iframeOnload" ref="iframe"></iframe>
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

window.addEventListener('message',function(e){
    let data =e.data;
    console.log( 'receive iframe data', data );
    console.dir( e );
},false);

export default {
    mixins: [ dataMixin ]
    , data() {
        return {
            iframeUrl: 'about:blank'
        }
    }
    , methods: {
        login() {
            let backUrl = encodeURIComponent( location.href );
            let oauth = `http://btbtd.org/api/saveanywhere?logintype=github`
            oauth = 'http://btbtd.org/api/saveanywhere/?s=/Index/Index/pushmessage';

            console.log( oauth );
            //location.href = oauth;
            this.iframeUrl = oauth;
        }
        , iframeOnload(){
            console.log( 'onload', Date.now() );
            console.dir( this.$refs.iframe );
        }
    }
    , mounted(){

    }
}
</script>
