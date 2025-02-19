<template>
  <div>
    <Tabs v-model:active="activeTab">
      <Tab v-for="(item, index) in statusTabLabel" :key="index" :name="index" :title="item" />
    </Tabs>
    <Card
      v-for="order in orderList"
      :key="order.id"
      class="order-card"
      :price="order.payAmount"
      :thumb="order.itemAvatar"
      :tag="order.orderType"
      :desc="order.createTime"
    >
      <template #title>
        <div class="title">
          <h4>订单号：{{ order.id }}</h4>
          <span class="infotext">{{ order.statusText }}</span>
        </div>
      </template>
      <template #bottom>
        <p class="infotext">{{ `共${order.itemCount}件` }}</p>
      </template>
      <template #footer>
        <slot name="footer">
          <Button
            v-if="order.status === ORDER_STATUS.CANCEL || order.status === ORDER_STATUS.FINISHED"
            @click="handleRemoveOrder(order.id)"
            type="danger"
            plain
            size="mini"
          >
            删除
          </Button>
          <Button
            v-if="
              order.status === ORDER_STATUS.WAIT_PAY || order.status === ORDER_STATUS.WAIT_HANDLE
            "
            type="default"
            @click="handleCancelOrder(order.id)"
            plain
            size="mini"
          >
            取消订单
          </Button>
          <Button
            @click="$router.push(`/order_detail?id=${order.id}`)"
            type="primary"
            plain
            size="mini"
          >
            详情
          </Button>
          <Button v-if="order.status === ORDER_STATUS.FINISHED" type="success" size="mini">
            再次购买
          </Button>
        </slot>
      </template>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { cancelOrder, getOrderList, removeOrder } from '@/api/modules/order';
import { ORDER_STATUS } from '@/common/constant';
import { ORDER_STATUS_LABEL, ORDER_TYPE_LABEL } from '@/common/constantLabel';
import { Tabs, Tab, Card, Button, showConfirmDialog, showSuccessToast } from 'vant';
import { ref, watch } from 'vue';

// eslint-disable-next-line
const { removed, ...statusTabLabel } = { all: '全部', ...ORDER_STATUS_LABEL };

// 分类
const activeTab = ref<keyof typeof statusTabLabel>('all');

type OrderListItem = {
  createTime: string;
  id: number;
  status: ORDER_STATUS;
  statusText: string;
  orderType: string;
  payAmount: number;
  itemCount: number;
  itemAvatar: string;
};
const orderList = ref<OrderListItem[]>([]);

// 获取订单列表
async function getData() {
  let queryParam = {};
  if (activeTab.value !== 'all') {
    queryParam = { status: [activeTab.value] };
  }
  const { data: result } = await getOrderList(queryParam);

  orderList.value = result.list.map((order) => {
    return {
      createTime: new Date(order.createTime).toLocaleString(),
      id: order.id,
      status: order.status,
      statusText: ORDER_STATUS_LABEL[order.status],
      orderType: ORDER_TYPE_LABEL[order.orderType],
      payAmount: order.payAmount,
      itemCount: order.items.length,
      itemAvatar: order.avatar,
    };
  });
}

watch(
  activeTab,
  () => {
    getData();
  },
  {
    immediate: true,
  },
);

// 删除订单
function handleRemoveOrder(orderId: number) {
  showConfirmDialog({
    title: '删除订单',
    message: '确定删除订单吗？',
  })
    .then(() => {
      removeOrder(orderId).then(() => {
        showSuccessToast('删除成功！');
        getData();
      });
    })
    .catch(() => {});
}

// 取消订单
function handleCancelOrder(orderId: number) {
  showConfirmDialog({
    title: '取消订单',
    message: '确定取消订单吗？',
  })
    .then(() => {
      cancelOrder(orderId).then(() => {
        showSuccessToast('取消成功！');
        getData();
      });
    })
    .catch(() => {});
}
</script>
<style scoped>
.order-card {
  background-color: #fff;
  margin: 0.5rem;
  border-radius: 0.5rem;

  .title {
    display: flex;
    > h4 {
      flex: 1;
    }
  }
}
</style>
