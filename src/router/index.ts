import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          name: 'landing',
          component: () => import('@/views/auth/LandingPage.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/RecoveryView.vue'),
        },
      ],
    },
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'portfolio-dashboard',
          component: () => import('@/views/portfolio/PortfolioDashboard.vue'),
        },
        {
          path: 'position/:ticker',
          name: 'position-details',
          component: () => import('@/views/portfolio/PositionDetailsView.vue'),
          props: true,
        },
        {
          path: 'trade',
          name: 'trade-search',
          component: () => import('@/views/trade/TradeView.vue'),
        },
        {
          path: 'trade/:ticker',
          name: 'trade-detail',
          component: () => import('@/views/trade/TradeDetailsView.vue'),
        },
        {
          path: 'orders',
          name: 'orders-list',
          component: () => import('@/views/orders/OrderHistory.vue'),
        },
        {
          path: 'bank',
          name: 'bank-statement',
          component: () => import('@/views/bank/BankStatement.vue'),
        },
        {
          path: 'profile',
          name: 'user-profile',
          component: () => import('@/views/account/UserProfile.vue'),
        },
      ],
    },
  ],
})

export default router
