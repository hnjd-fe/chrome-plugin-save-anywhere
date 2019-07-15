<template>
<el-container>
    <el-main>
        <el-row>
            <databaseInfo ref="databaseInfo"></databaseInfo>
        </el-row>
        <el-row>
            <el-button type="primary" style="width:180px;" id="login" v-if="!token">
                {{$t('login_github')}}<i class="el-icon-user-solid el-icon--right"></i></el-button>

            <el-button type="primary" style="" id="logout" v-if="token">
                {{$t('logout')}} {{nickname}}@{{logintype}}<i class="el-icon-user-solid el-icon--right"></i></el-button>
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
            token: localStorage.getItem( 'token' )
            , email: localStorage.getItem( 'email' )
            , username: localStorage.getItem( 'username' )
            , nickname: localStorage.getItem( 'nickname' )
            , md5: localStorage.getItem( 'md5' )
            , logintype: localStorage.getItem( 'logintype' )
        }
    }
    , methods: {
        setDataItem( key, val ){
            if( this.$route.query[key]){
                localStorage.setItem( key, this.$route.query[key]);
                this.$set( this.data || {}, key, val );
            }
        }
    }
    , mounted(){
        this.setDataItem( 'token' );
        this.setDataItem( 'username' );
        this.setDataItem( 'nickname' );
        this.setDataItem( 'email' );
        this.setDataItem( 'md5' );
        this.setDataItem( 'logintype' );

        if( this.$route.query.token ){
            setTimeout( ()=>{
                location.href = "sync.html" 
            }, 50 );
        }
    }
}
</script>
