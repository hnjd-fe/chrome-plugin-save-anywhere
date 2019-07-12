<template>
  <div id="app">
        <el-container style="height: 100%; border: 1px solid #eee">
          <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              >
                <el-link href="index.html" target="_save_anywhere_index">
                  <el-menu-item index="1">
                    <i class="el-icon-s-home"></i>{{$t('mainPage')}}
                  </el-menu-item>
                </el-link>
                <router-link to="importExport.html">
                  <el-menu-item index="2">
                    <i class="el-icon-upload2"></i>{{$t('importExport')}}
                  </el-menu-item>
                </router-link>

                <router-link to="sync.html" v-if="false">
                  <el-menu-item index="6" >
                    <i class="el-icon-upload"></i>{{$t('sync')}}
                  </el-menu-item>
                </router-link>

                <router-link to="dataManage.html" v-if="devMode">
                  <el-menu-item index="3" >
                    <i class="el-icon-data-board"></i>{{$t('dataManage')}}

                  </el-menu-item>
                </router-link>

                <el-link href="popup.html" target="_save_anywhere_popup" v-if="devMode">
                  <el-menu-item index="4">
                    <i class="el-icon-folder-opened"></i>{{$t('popupPage')}} 
                  </el-menu-item>
                </el-link>

                <router-link to="setting.html">
                  <el-menu-item index="5">
                    <i class="el-icon-setting"></i>{{$t('setting')}}
                  </el-menu-item>
                </router-link>
            </el-menu>
          </el-aside>
            <router-view @[this.globalVar.updateDevModeEventName]="devModeChange"></router-view>
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

.el-link {
    display: block;
}
</style>

<script>
window.name = '_save_anywhere_index';

export default {
	data() {
		return {
            devMode: this.globalVar.devMode
		}
	}
    , components: {
    }
    , computed: {
        
    }
	, methods: {
		devModeChange( val ){
			this.devMode = val;
		}
　　　　, refresh:function(){
　　　　　　this.$router.go(0);
　　　　}
	}
}
</script>


