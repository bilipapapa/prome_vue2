import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    meta: {
      title: '首页',
    },
    component: () => import(/* webpackChunkName: "home" */ ''),
  },
  {
    path: '/index',
    redirect: '/',
    meta: {
      title: '首页',
    },
  },
  {
    path: '/redirect',
    name: 'redirect',
    children: [],
  },
  {
    path: '*',
    name: '404',
    meta: {
      title: '404',
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
