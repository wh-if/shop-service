import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home/index.vue';
import PageLayout from '@/views/PageLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { showConfirmDialog } from 'vant';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
      },
      component: () => import('@/views/Login/index.vue'),
    },
    {
      path: '/',
      component: PageLayout,
      children: [
        {
          path: '',
          name: 'home',
          alias: '/home',
          meta: {
            title: '首页',
          },
          component: HomeView,
        },
        {
          path: '/self',
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: '',
              name: 'self',
              meta: {
                title: '我的',
              },
              component: () => import('@/views/Self/index.vue'),
            },
            {
              path: 'order',
              name: 'self_order',
              meta: {
                title: '我的订单',
              },
              component: () => import('@/views/Self/Order/index.vue'),
            },
            {
              path: 'collect',
              name: 'self_collect',
              meta: {
                title: '我的收藏',
              },
              component: () => import('@/views/Self/Collect/index.vue'),
            },
            {
              path: 'coupon',
              name: 'self_coupon',
              meta: {
                title: '我的优惠券',
              },
              component: () => import('@/views/Self/Coupon/index.vue'),
            },
          ],
        },
        {
          path: '/category',
          name: 'category',
          meta: {
            title: '分类',
          },
          component: () => import('@/views/Category/index.vue'),
        },
        {
          path: '/cart',
          name: 'cart',
          meta: {
            title: '购物车',
          },
          component: () => import('@/views/Cart/index.vue'),
        },
        {
          path: '/order_detail',
          name: 'order_deatail',
          meta: {
            title: '订单详情',
            requiresAuth: true,
          },
          component: () => import('@/views/OrderDetail/index.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/home' },
  ],
  scrollBehavior: () => {
    return {
      left: 0,
      top: 0,
    };
  },
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.hasLogin) {
    try {
      await showConfirmDialog({
        message: '需要登录才能访问！',
        confirmButtonText: '去登录',
      });

      return { name: 'login' };
    } catch {
      return false;
    }
  }
});

export default router;
