import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../components/Dashboard.vue'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../components/TransactionsPage.vue'),
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../components/AccountsPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
