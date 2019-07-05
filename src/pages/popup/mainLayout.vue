<template>
<el-container style="height: 500px; border: 1px solid #eee" class="popup_layout">
  <el-container>
      <el-header>
          <el-input
              placeholder="请输入内容"
              v-model="searchText"
              @input="onTextInput"
              >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>    
      </el-header>
    
    <el-main 
		v-loading="loading"
        :style="paddingMain"
	>
        <el-row v-for="( item, index ) in listData" :key="item.id"
		v-if="!loading"
        >
            <el-col :span="2" style="text-align: center; padding: 10px 0;">
                {{index+1}}.
            </el-col>

            <el-col :span="18" style="padding-bottom: 5px;">
                <div v-if="item.siteUrl">
                    <a :href="item.siteUrl" :title="item.siteTitle" style="display:block;padding-left:0!important;" target="_blank">
                        <label v-html="hightlightSearch(item.siteTitle)"></label>
                    </a>
                        <span v-html="hightlightSearch(item.note)"></span>
                </div>
                <div v-else>
                    <a :title="item.siteTitle" style="display:block;padding-left:0!important;" >
                        <label v-html="hightlightSearch(item.siteTitle)"></label>
                    </a>
                        <span v-html="hightlightSearch(item.note)"></span>
                </div>
            </el-col>
            <el-col :span="4" class="source">
                <div>
                    <a :href="'index.html?id='+item.id" title="来源详情" target="_blank">
                        <span>来源详情</span>
                    </a>
                </div>
            </el-col>
        </el-row>

		<el-row
			v-if="!listData.length && !loading"
			class="no-data"
		>
		暂无数据
		</el-row>

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

    <el-footer>
        <el-row>
            <el-col :span="12">
                <el-link :href="packInfo.homepage" target="_blank" class="pluginName">
                    <i class="el-icon-logo" style=""></i>
                    <span>{{packInfo.name}}</span>
                </el-link>
            </el-col>
            <el-col :span="12" style="text-align: right">
                <el-link href="./index.html" target="_save_anywhere_index" style="margin-right: -10px">
                    <i class="el-icon-setting" style="padding: 0 10px;"></i>
                </el-link>
            </el-col>
        </el-row>
    </el-footer>

  </el-container>
</el-container>
</template>
<style lang="less">

@import './index.less';

#app {
	position: relative;
}
.el-main {
	padding: 0px;
	position: relative;
}

.el-aside {
    color: #333;
}

.pluginName {
    float: left;
}

.el-row {
    text-align: left;
}
.el-main .el-row a {
    display: inline-block;
    padding: 10px 10px;
}
.el-main .el-row a label {
    display: block;
    font-weight: bold;
}
.el-main .el-row:nth-child(even){
    background-color: #ececec;
}
.el-main .el-row:nth-child(even) .source {
    background-color: #ececec;
    padding-bottom: 5px;
}

.el-header {
    //background-color: @headerBgColor;
    padding: 0px 0;
    color: #333;
    height: @barHeight!important;
    line-height: @barHeight;
    margin: -1px -1px 0 -1px;
}

.el-footer {
    background-color: @headerBgColor;
    height: @barHeight!important;
    line-height: @barHeight;
}
.el-pagination {
    position: absolute;
    bottom: 41px;
    background: #fff;
	height: 35px;
    padding-top: 5px;
}
.el-pagination a {
	min-width: 25px;
}

.no-data {
	text-align: center;
    padding: 20%;
    font-weight: bold;
    font-size: 32px;
    color: #ccc;
}
</style>

<script>
import config from '@src/chrome/config.js'
import dataMixin from '@src/mixin/data.js'

import moment from '@src/chrome/utils/moment.js'
const packInfo = require( '@root/package.json' )

export default {
    props: [ "packInfo" ],
    mixins: [ dataMixin ],
    data() {
        return {
        }
    }
    , created(){

    }
    , mounted(){
        let p = this;

		this.updateFullList( 1 );
    }
    , methods: {
		afterUpdateList(){
			this.loading = false;

            if( ( this.listTotal > this.listPageSize ) ){
                this.paddingMain = 'padding-bottom: 50px;'
            }

		}
    }
};
</script>

