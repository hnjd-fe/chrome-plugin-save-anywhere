<template>
<el-container style="height: 600px; border: 1px solid #eee" class="popup_layout">
  <el-container>
      <el-header>
            <el-row>
                <el-col :span="8">
                    <el-select v-model="filterStatus" 
                        @change="filterChange" 
                        style="width:95%;" 
                        size="medium"
                        >
                        <el-option
                            :label="$t(`status--1`)"
                            :value="-1">
                        </el-option>
                        <el-option
                            v-for="( item, index ) in typemap.status"
                            :key="index"
                            :label="$t(`status-${index}`)"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="14">
                  <el-input
                      :placeholder="$t('searchPlaceholder')"
                      v-model="searchText"
                      @input="onTextInput"
                      size="medium"
                      >
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>    

                </el-col>
                <el-col :span="2" style="text-align: center">
                    <el-button type="primary"  icon="el-icon-plus" circle style="zoom:.8"
                        @click="onAddItemFull"
                    ></el-button>
                </el-col>
            </el-row>
            </el-row>
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
                <div v-if="item.siteUrl && item.siteTitle">
                    <a :href="item.siteUrl" :title="item.siteTitle" style="display:block;padding-left:0!important;" target="_blank">
                        <label v-html="hightlightSearch(item.siteTitle)"></label>
                    </a>
                        <span v-html="hightlightSearch(item.note, 1, item)" v-linkified></span>
                </div>
                <div v-else>
                    <a :title="item.siteTitle" v-if="item.siteTitle"
                    style="display:block;padding-left:0!important;" >
                        <label v-html="hightlightSearch(item.siteTitle)"></label>
                    </a>
                        <span v-html="hightlightSearch(item.note, 1, item)" v-linkified></span>
                </div>
            </el-col>
            <el-col :span="4" class="source">
                <div>
                    <el-link :href="'index.html?id='+item.id" :title="$t('source')" :target="`_${packInfo.name}_index`">
                        <el-button  icon="el-icon-view" 
                        :title="$t('source')"
                        size="mini"
                        circle></el-button>
                    </el-link>

                    <el-button  icon="el-icon-edit" 
                    :title="$t('edit')"
                    @click="onEditItem( $event, item, 0 )"
                    size="mini"
                    circle></el-button>
                </div>
            </el-col>
        </el-row>

		<el-row
			v-if="!listData.length && !loading"
			class="no-data"
		>
		{{$t('nodata')}}
		</el-row>

    </el-main>
		<el-pagination
		  v-if="listData.length && !loading && listTotal > listPageSize && false"
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
            <el-col :span="13">
                <el-link :href="packInfo.homepage" target="_blank" class="pluginName">
                    <i class="el-icon-logo" style=""></i>
                    <span>{{packInfo.name}}</span>
                </el-link>
                <el-link v-if="token && !syncInProcessing" :title="$t('synchronous')" style="margin-left: 5px;" @click="synchronousData">
                     <i class="el-icon-refresh">{{$t('synchronous_short')}}</i>
                </el-link>
                <el-link v-if="token && syncInProcessing" style="margin-left: 5px;" >
                     {{$t('synchronous_in_processing_short')}}
                </el-link>
            </el-col>
            <el-col :span="11" style="text-align: right">
                <el-link id="login" v-if="!token">{{$t('login')}}@github</el-link>
                <el-link v-if="token" href="javascript:;" id="logout">{{$t('logout')}}</el-link>
                <el-link v-if="token">, </el-link>
                <el-link v-if="token" >{{nickname}}@{{logintype}} </el-link>

                <el-link href="./index.html"  :target="`_${packInfo.name}_index`" 
                    style="margin-right: -10px"
                    :title="$t('setting')"
                    >
                    <i class="el-icon-setting" style="padding: 0 10px;"></i>
                </el-link>
            </el-col>
        </el-row>
    </el-footer>

		<AddItemComp 
		:isedit="additemjson_pnt"
		:close="closeAdd"
		:update="updateList"
        frompage="popup"
		/>
		<EditItemComp 
		:isedit="itemjson"
		:close="closeEdit"
		:update="updateList"
        frompage="popup"
		/>

  </el-container>
</el-container>
</template>

<script>
import config from '@src/chrome/config.js'
import dataMixin from '@src/mixin/data.js'
import modifyMixin from '@src/mixin/modify.js'
import compsMixin from '@src/mixin/comps.js'

import moment from '@src/chrome/utils/moment.js'
const packInfo = require( '@root/package.json' )

let tmer;

export default {
    props: [ "packInfo" ],
    mixins: [ dataMixin, compsMixin, modifyMixin ],
    data() {
        return {
			additemjson_pnt: null
			, sortList: true
        }
    }
    , created(){

    }
    , mounted(){
        let p = this;

		this.updateFullList( 1 );

        this.initLogin();
    }
    , methods: {
        onAddItemFull() {
            this.additemjson_pnt = {
                type: 0
                , status: false
                , endDate: moment().add( 1, 'days')._d.getTime()
            };
        },
		afterUpdateList(){
			this.loading = false;

            if( ( this.listTotal > this.listPageSize ) ){
                this.paddingMain = 'padding-bottom: 50px;'
            }

		}
    }
};
</script>

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

.search_pre {
    margin-top: 10px;
}
</style>
