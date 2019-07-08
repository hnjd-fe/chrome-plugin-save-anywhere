import mainLayout from './mainLayout.vue';
import importExport from './importExport.vue';
import dataManage from './dataManage.vue';
import setting from './setting.vue';

const routes = [
    {
      path: '',
      component: mainLayout
    }
    , {
      path: '/*index.html/',
      component: mainLayout,
    }
    , {
      path: '/*importExport.html/',
      component: importExport,
    }
    , {
      path: '/*dataManage.html/',
      component: dataManage,
    }
    , {
      path: '/*setting.html/',
      component: setting,
    }
];

export default routes;

