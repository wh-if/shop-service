<template>
  <CheckboxGroup v-model="checkedList">
    <SwipeCell class="swipe-cell" v-for="(item, index) in props.list" :key="index">
      <div class="card-checkbox">
        <Checkbox v-if="props.checkVisible" style="padding: 0 0.5rem" :name="index" />
        <slot name="item" :item :index />
      </div>

      <template #right>
        <slot name="right" :index />
      </template>
    </SwipeCell>
  </CheckboxGroup>
</template>
<script setup lang="ts">
import { CheckboxGroup, Checkbox, SwipeCell } from 'vant';

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[];
    checkVisible?: boolean;
  }>(),
  {
    checkVisible: false,
  },
);

const checkedList = defineModel<number[]>('checkedList');
</script>
<style scoped>
.swipe-cell {
  margin: 0.5rem;
  border-radius: 0.5rem;
  background-color: #fff;

  .card-checkbox {
    display: flex;
  }
}
</style>
