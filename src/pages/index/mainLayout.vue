<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px">
      <el-row>
        <el-col :span="6">
          <span>
            <i class="el-icon-logo" style="margin-right: 0px"></i>
          </span>
          <label style="font-weight: bold; font-size: 16px;">{{packInfo.name}}</label>
          <span>{{$t('totalLabel')}}</span>
          <span>{{fullTotal}}</span>
          <span v-if="fullTotal != listTotal">, {{$t('curTotalLabel')}}</span>
          <span v-if="fullTotal != listTotal">{{listTotal}}</span>
          <el-link
            v-if="token && !syncInProcessing"
            :title="$t('synchronous')"
            style="margin-left: 5px; display: inline-block;"
            @click="synchronousData"
          >
            <i class="el-icon-refresh">{{$t('synchronous_short')}}</i>
          </el-link>
        </el-col>
        <el-col :span="18" style="text-align:right;">
          &nbsp;
          <el-input
            :placeholder="$t('searchPlaceholder')"
            v-model="searchText"
            @input="onTextInput"
            style="width:300px;"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>&nbsp;
          <el-radio-group v-model="filterStatus" @change="filterChange" style="margin-top:-5px;">
            <el-radio-button :label="-1">{{$t(`status--1`)}}</el-radio-button>
            <el-radio-button
              v-for="( item, index ) in typemap.status"
              :key="index"
              :label="item.value"
            >{{$t(`status-${item.value?1:0}`)}}</el-radio-button>
          </el-radio-group>&nbsp;
          <el-button type="primary" icon="el-icon-plus" circle style @click="onAddItemFull"></el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main v-loading="loading">
      <el-table :data="listData">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column :label="$t('note')">
          <template slot-scope="scope">
            <div>
              <a :href="scope.row.siteUrl" target="_blank">
                <label
                  v-if="scope.row.siteTitle"
                  style="display:block;font-weight:bold; margin-bottom:5px;"
                  v-html="hightlightSearch(scope.row.siteTitle)"
                ></label>
              </a>
              <span v-html="hightlightSearch(scope.row.note, 1, scope.row )"></span>
              <a :href="scope.row.siteUrl" target="_blank">
                <label
                  v-if="scope.row.siteUrl"
                  style="display:block; margin-top:5px;"
                >{{scope.row.siteUrl}}</label>
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('updateDate')" :width="180">
          <template slot-scope="scope">
            <span>{{moment(parseInt(scope.row.updateDate)).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" :width="200">
          <template slot-scope="scope">
            <el-button @click="onEditItem( $event, scope.row, 0 )" size="mini">{{$t('modify')}}</el-button>
            <el-button @click="onDeleteItem( $event, scope.row.id, scope.row )" size="mini">{{$t('delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <AddItemComp :isedit="additemjson_pnt" :close="closeAdd" :update="updateList" />
    <EditItemComp 
		:isedit="itemjson"
		:close="closeEdit"
		:update="updateList"
		/>
    <el-pagination
      v-if="listData.length && !loading && listTotal > listPageSize"
      background
      layout="prev, pager, next"
      :total="listTotal"
      :page-size="listPageSize"
      :current-page="listCurPage"
      @current-change="curListChange"
    ></el-pagination>
  </el-container>
</template>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-header .el-row {
  margin: 0 auto;
}

.el-table__row > td {
  vertical-align: top;
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
const packInfo = require("@root/package.json");

import "@src/assets/css/iconfont/iconfont.css";
import moment from "@src/chrome/utils/moment.js";
import config from "@src/chrome/config";

import dataMixin from "@src/mixin/data.js";
import compsMixin from "@src/mixin/comps.js";
import modifyMixin from "@src/mixin/modify.js";

export default {
  mixins: [dataMixin, compsMixin, modifyMixin],
  data() {
    return {
      packInfo: packInfo,
      additemjson_pnt: null,
      tmer: null,
      fullTotal: 0,
      listTotal: 0
    };
  },
  mounted() {
    let p = this;
    this.updateFullList(1, this.$route.query.id);
    this.loading = false;
  },
  methods: {
    moment

    , onAddItemFull() {
      this.additemjson_pnt = {
        type: 0,
        status: false,
        endDate: moment()
          .add(1, "days")
          ._d.getTime()
      };
    },
    closeAdd() {
      this.additemjson_pnt = null;
    },
    updateList(json, type, item) {
      this.tmer && clearTimeout(this.tmer);

      this.tmer = setTimeout(() => {
        this.updateFullList(1, this.$route.query.id);

        this.loading = false;
      }, 50);
    },
    afterUpdateList() {
      this.loading = false;

      if (this.listTotal > this.listPageSize) {
        this.paddingMain = "padding-bottom: 50px;";
      }
    },
    updateList(json, type, item) {
      this.tmer && clearTimeout(this.tmer);

      this.tmer = setTimeout(() => {
        this.updateFullList(1, this.$route.query.id);
      }, 50);
    },

    afterUpdateList() {
      if (this.listTotal > this.listPageSize) {
        this.paddingMain = "padding-bottom: 50px;";
      }
    },
    onDeleteItem(evt, id, item) {
      this.loading = 1;
      this.deleteItem(id, item.md5)
        .then(() => {
          for (let i = 0, j = this.listData.length; i < j; i++) {
            let tmp = this.listData[i];
            if (tmp.id == id) {
              this.listData.splice(i, 1);
              this.loading = 0;
              break;
            }
          }
          console.log("this.listData.legnth:", this.listData.length);
          if (!this.listData.length) {
            //this.updateFullList( 1 );
            console.log(
              "location.href",
              location.href.split("?")[0] + "?rnd=" + Date.now()
            );
            location.href = location.href.split("?")[0] + "?rnd=" + Date.now();
          }
        })
        .catch(err => {
          this.loading = 0;
          console.error(err);
        });
    }
  }
};
</script>
