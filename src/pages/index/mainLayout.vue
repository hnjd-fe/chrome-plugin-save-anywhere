<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px">
        <el-row>
            <el-col :span="10">
                <span>
                    <i class="el-icon-logo" style="margin-right: 15px"></i>
                </span>
                <label style="font-weight: bold; font-size: 16px;">{{packInfo.name}}</label>
                <span>{{$t('totalLabel')}} </span><span>{{fullTotal}}</span>
                <span v-if="fullTotal != listTotal">, {{$t('curTotalLabel')}} </span><span v-if="fullTotal != listTotal">{{listTotal}}</span>
            </el-col>
            <el-col :span="14" style="text-align:right;">
                  <el-input
                      :placeholder="$t('searchPlaceholder')"
                      v-model="searchText"
                      @input="onTextInput"
                      >
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>    
            </el-col>
        </el-row>
    </el-header>
    
    <el-main 
		v-loading="loading"
    >
      <el-table :data="listData">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column  :label="$t('note')">
            <template slot-scope="scope">
            <div>
                <a :href="scope.row.siteUrl" target="_blank">
                    <label v-if="scope.row.siteTitle" style="display:block;font-weight:bold; margin-bottom:5px;"
                    v-html="hightlightSearch(scope.row.siteTitle)"
                    ></label>
                </a>
                    <span v-html="hightlightSearch(scope.row.note, 1, scope.row )"></span>
                <a :href="scope.row.siteUrl" target="_blank">
                    <label v-if="scope.row.siteUrl" style="display:block; margin-top:5px;">{{scope.row.siteUrl}}</label>
                </a>
            </div>
            </template>
        </el-table-column>
        <el-table-column  :label="$t('updateDate')" :width="180">
            <template slot-scope="scope">
                <span>{{moment(parseInt(scope.row.updateDate)).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
        </el-table-column>
        <el-table-column  :label="$t('operation')" :width="200">
            <template slot-scope="scope">
                <el-button v-if="false">{{$t('modify')}}</el-button>
                <el-button @click="onDeleteItem( $event, scope.row.id, scope.row )">{{$t('delete')}}</el-button>
            </template>
        </el-table-column>

      </el-table>
    </el-main>
		<el-pagination
		  v-if="listData.length && !loading && listTotal > listPageSize"
		  background
		  layout="prev, pager, next"
		  :total="listTotal"
		  :page-size="listPageSize"
		  :current-page="listCurPage"
		  @current-change="curListChange"
		  >
		</el-pagination>

  </el-container>
</template>

<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-header .el-row {
    margin: 0 auto;
}

.el-aside {
    color: #333;
}

.el-pagination {
    text-align: right;
    padding: 10px;
}
</style>

<script>

import moment from '@src/chrome/utils/moment.js'
import config from '@src/chrome/config'

import dataMixin from '@src/mixin/data.js'

const packInfo = require( '@root/package.json' )

export default {
    mixins: [ dataMixin ]
    , data() {
        return {
            packInfo: packInfo
        }
    }
    , mounted(){
        let p = this;
		this.updateFullList( 1, this.$route.query.id );
    }
    , methods: {
        moment
		, afterUpdateList(){
			this.loading = false;

            if( ( this.listTotal > this.listPageSize ) ){
                this.paddingMain = 'padding-bottom: 50px;'
            }
		}
        , onDeleteItem( evt, id, item ){
            this.loading = 1;
            this.deleteItem( id, item.md5 ).then( ( )=> {
                for( let i = 0, j = this.listData.length; i < j; i++ ){
                    let tmp = this.listData[ i ];
                    if( tmp.id == id ){
                        this.listData.splice( i, 1 );
                        this.loading = 0;
                        break;
                    }
                }
                if( !this.listData.legnth ){
                    this.updateFullList( 1 );
                }
            }).catch( err => {
                this.loading = 0;
            });
        }
    }

};
</script>
