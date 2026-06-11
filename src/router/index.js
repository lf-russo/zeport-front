import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/templates'
      },
      {
        path: 'templates',
        name: 'Templates',
        component: () => import('@/pages/TemplatesPage.vue')
      },
      {
        path: 'templates/new',
        name: 'BuilderNew',
        component: () => import('@/pages/BuilderPage.vue')
      },
      {
        path: 'templates/:id/edit',
        name: 'BuilderEdit',
        component: () => import('@/pages/BuilderPage.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/pages/ReportsPage.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/SettingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.token) {
    return { name: 'Login' }
  }
})

export default router
