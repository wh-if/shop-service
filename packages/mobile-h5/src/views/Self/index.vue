<template>
  <div class="self-info">
    <CellGroup>
      <Cell is-link center>
        <template #title>
          <div class="header">
            <Image width="4rem" :src="authStore.state?.userInfo.avatar" />
            <div class="info-box">
              <h2>{{ authStore.state?.userInfo.name }}</h2>
              <p class="infotext">用户ID: {{ authStore.state?.userInfo.id }}</p>
            </div>
          </div>
        </template>
      </Cell>
    </CellGroup>
    <CellGroup style="margin-top: 0.5rem">
      <Cell icon="bill-o" title="我的订单" url="/self/order" is-link />
      <Cell icon="goods-collect-o" url="/self/collect" title="收藏" is-link />
      <Cell icon="coupon-o" title="优惠券" is-link />
    </CellGroup>
  </div>
</template>
<script setup lang="ts">
import { CellGroup, Cell, Image } from 'vant';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>
<style scoped>
.self-info {
  .header {
    display: flex;
    padding: 1.2rem 0;

    .info-box {
      margin-left: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
</style>
