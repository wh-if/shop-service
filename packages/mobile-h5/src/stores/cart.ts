import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Order } from '@/api/modules/order';

export const useCartStore = defineStore('cart', () => {
  /** 购物车条目信息 */
  const orderDetailList = ref<Order.DetailInsertParam[]>([]);

  /** 添加到购物车 */
  function add(data: Order.DetailInsertParam) {
    orderDetailList.value.unshift(data);
  }

  /** 从购物车移除 */
  function remove(index: number | number[]) {
    if (!Array.isArray(index)) {
      index = [index];
    }
    index.forEach((i) => {
      orderDetailList.value.splice(i, 1);
    });
  }

  /** 清空购物车 */
  function clear() {
    orderDetailList.value.length = 0;
  }

  return { orderDetailList, add, remove, clear };
});
