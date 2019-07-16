import mainLayout from './mainLayout.vue';

const routes = [
    {
      path: '',
      component: mainLayout
    }
    , {
      path: '/*popup.html/',
      component: mainLayout,
    }
];

export default routes;

