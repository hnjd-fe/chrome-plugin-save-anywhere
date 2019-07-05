import mainLayout from './mainLayout.vue';
import importExport from './importExport.vue';
import dataManage from './dataManage.vue';

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
];

export default routes;

