import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EmployeesView from '../views/EmployeesView.vue';
import AuthView from '../views/AuthView.vue';
import store from '../store/store.js';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/employees',
    name: 'employees',
    component: EmployeesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'authentication',
    component: AuthView,
    meta: { requiresUnauth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
    next('/auth');
  } else if (to.meta.requiresUnauth && store.getters['auth/isAuthenticated']) {
    next('/');
  } else {
    next();
  }
});

export default router
