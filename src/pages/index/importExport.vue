<template>
<el-container>
    <el-main>
        <el-row>
            <databaseInfo ref="databaseInfo"></databaseInfo>
        </el-row>
        <el-row>
            <el-button type="primary" @click="backup()" style="width:180px;">
                {{$t('backupData')}}<i class="el-icon-download el-icon--right"></i></el-button>
        </el-row>
        <el-row >
            <el-col :span="10" style="width:190px;">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="upload.html"
                  :on-change="handleChange"
                  accept=".json"
                  :multiple="false"
                  :limit="1"
                  :auto-upload="false">
                      <el-button slot="trigger" type="primary" style="width:180px;">{{$t('restoreData')}}<i class="el-icon-upload2 el-icon--right"></i></el-button>
                      <div slot="tip" class="el-upload__tip">{{$t('restoreDataDesc')}}</div>
                  </el-upload>
            </el-col>
            <el-col :span="6" style="line-height:40px;">
                  <el-checkbox 
                      :label="$t('cleanData')" 
                      v-model="restoreClean"
                      @change="updateRestoreClean"
                  ></el-checkbox>
            </el-col>


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
            backupLock: 0
            , totalDataNum: 0
            , restoreClean: this.globalVar.restoreClean
        }
    }
    , computed: {

    }
    , methods: {
        updateRestoreClean( val ){
            this.globalVar.updateRestoreClean( val );
        }
        , handleChange(file) {
            const h = this.$createElement;
            if( this.restoreLock  ){
                this.$message({
                  message: '数据导入中，请稍候...',
                  type: 'warning'
                });
                return;
            }
            this.restoreLock = 1;
            this.$message({
              message: '数据正在导入，请稍候...',
              type: 'info'
            });

            setTimeout( ()=>{
                db.restore(file, this.restoreClean ).then( ()=>{
                    this.restoreLock = 0;
                    try{  
                        this.$refs['upload'].clearFiles();
                    }catch(ex){

                    }
                    this.$message({
                      message: '恭喜你，数据导入成功',
                      type: 'success'
                    });
                    this.updateTotal();
                } ).catch( ()=>{
                    this.restoreLock = 0;
                    this.$message({
                        message: '数据导入失败',
                        type: 'error'
                    });
                    this.updateTotal();
                } );
            }, config.operationDelayMs )
        }
        , backup() {
            const h = this.$createElement;
            if( this.backupLock  ){
                this.$message({
                  message: '数据备份中，请稍候...',
                  type: 'warning'
                });
                return;
            }
            this.backupLock = 1;
            this.$message({
              message: '数据正在备份，请稍候...',
              type: 'info'
            });
            setTimeout( ()=>{
                db.backup().then( ()=>{
                   this.backupLock = 0;
                    this.$message({
                      message: '恭喜你，数据备份成功',
                      type: 'success'
                    });
                    this.updateTotal();
                    console.log( 'success' )
                } ).catch( ()=>{
                   this.backupLock = 0;
                   this.$message({
                      message: '数据备份失败',
                      type: 'error'
                    });
                    this.updateTotal();
                    console.log( 'error' )
                });
            }, config.operationDelayMs )
        }
    }
    , mounted(){

    }
}
</script>
