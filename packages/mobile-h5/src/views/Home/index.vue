<template>
  <div class="page-content">
    <Swipe>
      <SwipeItem>1</SwipeItem>
      <SwipeItem>1</SwipeItem>

      <SwipeItem>1</SwipeItem>

      <SwipeItem>1</SwipeItem>
    </Swipe>
    <div class="category-list">
      <Button type="primary" @click="() => goCategory()">全部分类</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Swipe, SwipeItem, Button } from 'vant';
import { useRouter } from 'vue-router';
const router = useRouter();
function goCategory(id?: number) {
  router.push(`/category?id=${id}`);
}
</script>
<style scoped>
.page-content {
  .category-list {
  }
}
</style>
