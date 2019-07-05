<template>
<el-container>
    <el-main>
        <el-row>
            <databaseInfo ref="databaseInfo"></databaseInfo>
        </el-row>
        <el-row>
            <el-button type="primary" @click="backup()">生成备份文件<i class="el-icon-download el-icon--right"></i></el-button>
        </el-row>
        <el-row>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="upload.html"
              :on-change="handleChange"
              accept=".json"
              :multiple="false"
              :limit="1"
              :auto-upload="false">
                  <el-button slot="trigger" type="primary">从备份文件恢复</el-button>
                  <div slot="tip" class="el-upload__tip">只能恢复.josn文件</div>
              </el-upload>
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
        }
    }
    , computed: {

    }
    , methods: {
        handleChange(file) {
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
                db.restore(file).then( ()=>{
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
