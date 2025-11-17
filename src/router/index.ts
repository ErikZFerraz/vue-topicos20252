import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: () => import('../views/UsuarioView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/anotacao',
      name: 'anotacao',
      component: () => import('../views/AnotacaoView.vue'),
    },
    {
      path: '/revisao',
      name: 'Revisao',
      component: () => import('@/views/ReviseSuasSecoes.vue')
    },
    {
      path: '/listas',
      name: 'Listas',
      component: () => import('@/views/Listas.vue') // 👈 nova rota
    }
  ],
})

export default router
