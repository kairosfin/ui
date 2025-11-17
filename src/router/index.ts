import LandingPage from '@/views/LandingPageView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LandingPage,
    },
    {
      path: '/register',
      component: () => import('@/views/account/AccountRegisterView.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/account/AccountLoginView.vue'),
    },
    {
      path: '/forgot-password',
      component: () => import('@/views/account/AccountRecoveryView.vue'),
    },
    {
      path: '/app',
      component: () => import('@/views/app/AppLayoutView.vue'),
      children: [
        {
          path: 'portfolio',
          component: () => import('@/views/app/PortfolioView.vue'),
        },
        {
          path: 'trade',
          component: () => import('@/views/app/TradeView.vue'),
        },
        {
          path: 'profile',
          component: () => import('@/views/app/ProfileView.vue'),
        },
      ],
    },
  ],
})

export default router
