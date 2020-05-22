import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/userList.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/parmar.vue'
import list from '../components/goods/list.vue'
import Add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: cate },
      { path: '/params', component: params },
      { path: '/goods', component: list },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: order },
      { path: '/reports', component: report }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokeStr = window.sessionStorage.getItem('token')
  if (!tokeStr) return next('/login')
  next()
})
export default router
