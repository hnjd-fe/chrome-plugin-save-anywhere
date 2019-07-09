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
    , methods: {
        updateRestoreClean( val ){
            this.globalVar.updateRestoreClean( val );
        }
        , handleChange(file) {
            if( this.restoreLock  ){
                this.$message({
                  message: this.$t('importingInfo'),
                  type: 'warning'
                });
                return;
            }

            this.restoreLock = 1;
            this.$message({
              message: this.$t('importNowInfo'),
              type: 'info'
            });

            let r = new FileReader( );

            r.readAsText( file.raw )

            r.onload = ()=>{
                if( !r.result ){
                    this.$message({
                      message: this.$t('fileEmptyInfo'),
                      type: 'warning'
                    });

                    this.$refs.upload.clearFiles();
                    this.restoreLock = 0;
                    return;
                }

                let result = JSON.parse( r.result );
                if( !( result && result.notes && result.notes.length ) ){
                    this.$message({
                      message: this.$t('dataEmptyInfo'),
                      type: 'warning'
                    });

                    this.$refs.upload.clearFiles();
                    this.restoreLock = 0;
                    return;
                }

                setTimeout( ()=>{
                    db.restore( r.result, this.restoreClean ).then( ()=>{
                        this.restoreLock = 0;
                        try{  
                            this.$refs['upload'].clearFiles();
                        }catch(ex){

                        }
                        this.$message({
                          message: this.$t('importSuccessInfo'),
                          type: 'success'
                        });
                        this.updateTotal();
                    } ).catch( ()=>{
                        this.restoreLock = 0;
                        this.$message({
                            message: this.$t('importErrorInfo'),
                            type: 'error'
                        });
                        this.updateTotal();
                    } );
                }, config.operationDelayMs )

            };
        }
        , backup() {
            const h = this.$createElement;
            if( this.backupLock  ){
                this.$message({
                  message: this.$t('backupingInfo'),
                  type: 'warning'
                });
                return;
            }
            this.backupLock = 1;
            this.$message({
              message: this.$t('backupNowInfo'),
              type: 'info'
            });
            setTimeout( ()=>{
                db.backup().then( ()=>{
                   this.backupLock = 0;
                    this.$message({
                      message: this.$t('backupSuccessInfo'),
                      type: 'success'
                    });
                    this.updateTotal();
                    console.log( 'success' )
                } ).catch( ()=>{
                   this.backupLock = 0;
                   this.$message({
                      message: this.$t('backupErrorInfo'),
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
