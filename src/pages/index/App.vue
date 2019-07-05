<template>
  <div id="app">
        <el-container style="height: 100%; border: 1px solid #eee">
          <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              >
                <router-link to="index.html">
                  <el-menu-item index="1">
                    <i class="el-icon-s-home"></i>主页
                  </el-menu-item>
                </router-link>
                <router-link to="importExport.html">
                  <el-menu-item index="2">
                    <i class="el-icon-upload"></i>导入/导出
                  </el-menu-item>
                </router-link>
                <router-link to="dataManage.html">
                  <el-menu-item index="3">
                    <i class="el-icon-data-board"></i>数据管理
                  </el-menu-item>
                </router-link>
                <el-link href="popup.html" target="_save_anywhere_popup">
                  <el-menu-item index="3">
                    <i class="el-icon-folder-opened"></i>popup 页面 
                  </el-menu-item>
                </el-link>
            </el-menu>
          </el-aside>
            <router-view></router-view>
        </el-container>
  </div>
</template>

<style>
@import './index.less';
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  background: transparent;
}
#app {
  width: 100%;
  height: 100%;
}
</style>

<script>
window.name = '_save_anywhere_index';

export default {
    components: {
    }
}
</script>


