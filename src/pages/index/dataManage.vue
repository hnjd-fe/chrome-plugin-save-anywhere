<template>
<el-container>
    <el-main>
        <el-row>
            <databaseInfo ref="databaseInfo"></databaseInfo>
        </el-row>
        <el-row>
            <el-button type="primary" @click="dataGenerator()">{{$t('generateDataLabel')}}<i class="el-icon-circle-plus el-icon--right"></i></el-button>
        </el-row>
        <el-row>
            <el-button type="primary" @click="clearData()">{{$t('cleanAllData')}}<i class="el-icon-delete el-icon--right"></i></el-button>
        </el-row>
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
            clearDataLock: 0
            , dataGeneratorLock: 0
            , config: config
            , totalDataNum: 0
        }
    }
    , computed: {

    }
    , methods: {
        clearData() {
            const h = this.$createElement;
            if( this.clearDataLock  ){
                this.$message({
                  message: this.$t('cleaningDataInfo'),
                  type: 'warning'
                });
                return;
            }
            this.$message({
              message: this.$t('cleanDataNowInfo'),
              type: 'info'
            });
            this.clearDataLock = 1;
            setTimeout( ()=>{
                db.clearData().then( ()=>{
                   this.clearDataLock = 0;
                    this.$message({
                      message: this.$t('cleanDataSuccessInfo'),
                      type: 'success'
                    });
                    this.updateTotal();
                } ).catch( (err)=>{
                    this.$message({
                      message: this.$t('cleanDataErrorInfo') + ' '  + err,
                      type: 'error'
                    });
                    this.clearDataLock = 0;
                } );
            }, 500 )
        }
        , dataGenerator() {
            const h = this.$createElement;
            if( this.dataGeneratorLock  ){
                this.$message({
                  message: this.$t('producingDataInfo'),
                  type: 'warning'
                });
                return;
            }
            this.$message({
              message: this.$t('productDataNowInfo'),
              type: 'info'
            });
            this.dataGeneratorLock = 1;
            setTimeout( ()=>{
                db.dataGenerator().then( ()=>{
                    this.dataGeneratorLock = 0;
                    this.$message({
                      message: this.$t('productDataSuccessInfo'),
                      type: 'success'
                    });
                    this.updateTotal();
                } ).catch( (err)=>{
                    this.$message({
                      message: this.$t('productDataErrorInfo') + ' ' + err,
                      type: 'error'
                    });
                    this.dataGeneratorLock = 0;
                } );
            }, 500 )
        }
    }
    , mounted(){
        this.updateTotal();
    }
};
</script>
