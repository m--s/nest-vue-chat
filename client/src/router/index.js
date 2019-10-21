import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/client',
  },
  {
    path: '/client',
    name: 'client',
    component: () => import(/* webpackChunkName: "client" */ '../views/Client.vue'),
  },
  {
    path: '/host',
    name: 'Host',
    component: () => import(/* webpackChunkName: "client" */ '../views/Host.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
