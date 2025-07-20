import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Login from '@/views/Login.vue';
import Gold from '@/views/Gold.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: Login },
  { path: '/gold', name: 'Gold', component: Gold, meta: { hideHeader: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
