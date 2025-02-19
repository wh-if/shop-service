<template>
  <div class="page-content">
    <CellGroup class="card-box" inset>
      <Cell title="订单状态" :value="formattedOrderInfo.status" />
      <Cell title="订单类型" :value="formattedOrderInfo.orderType" />
      <Cell title="期望时间" :value="formattedOrderInfo.expectTime" />
      <Cell title="备注" :value="formattedOrderInfo.note" />
    </CellGroup>
    <CellGroup class="card-box" inset>
      <GoodsCard
        v-for="item in orderData?.items"
        :key="item.id"
        :data="item.target"
        :show-add-btn="false"
        :order-info="{ quantity: item.quantity, chooseOption: item.chooseOption }"
      />
    </CellGroup>
    <CellGroup class="card-box" inset>
      <Cell title="订单编号" :value="formattedOrderInfo.id" />
      <Cell title="实付款" :value="formattedOrderInfo.payAmount">
        <template #value>
          <span style="color: red">{{ formattedOrderInfo.totalDecrease }}</span>
          <Divider vertical />
          <span>{{ formattedOrderInfo.payAmount }}</span>
        </template>
      </Cell>
      <Cell title="下单时间" :value="formattedOrderInfo.createTime" />
      <Cell
        v-if="formattedOrderInfo.payTime"
        title="支付时间"
        :value="formattedOrderInfo.payTime"
      />
      <Cell
        v-if="formattedOrderInfo.finishTime"
        title="完成时间"
        :value="formattedOrderInfo.finishTime"
      />
    </CellGroup>

    <div class="action-btn">
      <Button
        v-if="
          orderData?.status === ORDER_STATUS.WAIT_PAY ||
          orderData?.status === ORDER_STATUS.WAIT_HANDLE
        "
        style="flex: 1"
        @click="handleCancelOrder"
        type="default"
      >
        取消订单
      </Button>
      <Button
        v-if="orderData?.status === ORDER_STATUS.WAIT_PAY"
        @click="payPopupState.show = true"
        style="flex: 3"
        type="danger"
      >
        立即支付
      </Button>
    </div>

    <Popup v-model:show="payPopupState.show" position="bottom" class="pay-popup">
      <Field label="支付方式">
        <template #input>
          <RadioGroup v-model="payPopupState.payType">
            <Radio v-for="item in PAY_TYPE" :key="item" :name="item">
              {{ PAY_TYPE_LABEL[item] }}
            </Radio>
          </RadioGroup>
        </template>
      </Field>

      <AuthForm ref="authFormRef" v-model="payPopupState.authValue" :show-tel="false" />
      <Button @click="handlePayOrder" type="primary" block> 确认支付 </Button>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, onMounted, reactive, ref, useTemplateRef } from 'vue';
import { cancelOrder, getOrderInfo, payOrder, type Order } from '@/api/modules/order';
import {
  showFailToast,
  Button,
  Cell,
  CellGroup,
  Divider,
  showConfirmDialog,
  showSuccessToast,
  Popup,
  RadioGroup,
  Radio,
  Field,
  type FormInstance,
} from 'vant';
import GoodsCard from '@/components/GoodsCard.vue';
import { ORDER_STATUS_LABEL, ORDER_TYPE_LABEL, PAY_TYPE_LABEL } from '@/common/constantLabel';
import { ORDER_STATUS, PAY_TYPE } from '@/common/constant';
import AuthForm from '@/components/AuthForm.vue';

const router = useRouter();

const orderData = ref<Order.OrderWithItemRaw>();

type FormattedOrderInfo = {
  id: string;
  totalDecrease: string;
  payAmount: string;
  expectTime: string;
  note: string;
  orderType: string;
  status: string;
  createTime: string;
  payTime?: string;
  finishTime?: string;
};

const formattedOrderInfo = computed<FormattedOrderInfo>(() => {
  if (orderData.value) {
    return {
      id: orderData.value.id.toString(),
      totalDecrease: `共减：${(orderData.value.amount - orderData.value.payAmount).toFixed(2)}`,
      payAmount: `${orderData.value.payAmount}`,
      expectTime: new Date(orderData.value.expectTime).toLocaleString(),
      note: orderData.value.note,
      orderType: ORDER_TYPE_LABEL[orderData.value.orderType],
      status: ORDER_STATUS_LABEL[orderData.value.status],
      createTime: new Date(orderData.value.createTime).toLocaleString(),
      payTime: orderData.value.payTime && new Date(orderData.value.payTime).toLocaleString(),
      finishTime:
        orderData.value.finishTime && new Date(orderData.value.finishTime).toLocaleString(),
    };
  } else {
    return {
      id: '',
      totalDecrease: '',
      payAmount: '',
      expectTime: '',
      note: '',
      orderType: '',
      createTime: '',
      status: '',
    };
  }
});

/** 获取订单数据 */
async function getOrderData() {
  try {
    const orderId = parseInt(router.currentRoute.value.query.id as string);
    const { data } = await getOrderInfo(orderId);
    orderData.value = data;
  } catch {
    showFailToast('数据异常，请重试！');
    router.back();
  }
}

// 取消订单
function handleCancelOrder() {
  showConfirmDialog({
    title: '取消订单',
    message: '确定取消订单吗？',
  })
    .then(() => {
      cancelOrder(orderData.value!.id).then(() => {
        showSuccessToast('取消成功！');
        getOrderData();
      });
    })
    .catch(() => {});
}

const payPopupState = reactive({
  show: false,
  payType: PAY_TYPE.DEAFULT,
  authValue: {
    authcode: '',
  },
});

const authFormRef = useTemplateRef<Pick<FormInstance, 'validate'>>('authFormRef');
// 支付订单
function handlePayOrder() {
  authFormRef.value?.validate().then(() => {
    payOrder({
      id: orderData.value!.id,
      payType: payPopupState.payType,
      authcode: payPopupState.authValue.authcode,
    }).then(() => {
      showSuccessToast('支付成功！');
      getOrderData();
      payPopupState.show = false;
    });
  });
}

onMounted(() => {
  getOrderData();
});
</script>

<style scoped>
.page-content {
  padding-bottom: 5rem;
}
.card-box {
  margin-top: 2vh;
  padding: 1rem 0;
}

.action-btn {
  position: fixed;
  bottom: 1rem;
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  display: flex;

  button {
    margin: 0 0.5rem;
  }
}

.pay-popup {
  padding: 1rem 0.5rem 2rem;
}
</style>
