<template>
  <NavBar class="nav-bar" :clickable="false">
    <template #left>
      <Icon v-show="backShow" class="btn" @click="handleBack" name="arrow-left" />
      <Icon v-show="homeShow" class="btn" @click="router.push('/home')" name="home-o" />
    </template>
    <template #title>
      <h1>{{ pageTitle }}</h1>
    </template>
    <template #right>
      <Icon class="btn" :badge="badgeValue" @click="router.push('/cart')" name="cart-o" />
      <Icon class="btn" @click="router.push('/self')" name="wap-nav" />
    </template>
  </NavBar>

  <RouterView class="page-main" />
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { NavBar, Icon } from 'vant';
import { useCartStore } from '@/stores/cart';
import { computed, ref } from 'vue';

const cartStore = useCartStore();
const router = useRouter();

/** 购物车商品数量 */
const badgeValue = computed(() => cartStore.orderDetailList.length || undefined);
/** 页面标题 */
const pageTitle = computed(() => router.currentRoute.value.meta.title);
/** 是否展示返回按钮 */
const backShow = ref(getShowValue('back'));
/** 是否展示首页按钮 */
const homeShow = ref(getShowValue('home'));

router.afterEach(() => {
  backShow.value = getShowValue('back');
  homeShow.value = getShowValue('home');
});

function getShowValue(type: 'back' | 'home') {
  return type === 'back'
    ? router.options.history.state.position !== 0
    : router.currentRoute.value.path !== '/home';
}

/** 路由返回 */
function handleBack() {
  router.back();
}
</script>
<!-- TODO 动态适配 -->
<style scoped>
.nav-bar {
  height: 3rem;
  position: fixed;
  top: 0;
  width: 100%;

  padding: 0.5rem 0 0;
  h1 {
    font-size: 1rem;
  }
  .btn {
    font-size: 1rem;
    margin: 0 0.5rem;
  }
}

.page-main {
  padding-top: 3rem;
}
</style>
