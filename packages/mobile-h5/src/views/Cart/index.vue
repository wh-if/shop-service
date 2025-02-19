<template>
  <div class="cart-page">
    <ActionList :list="list" :check-visible="true" v-model="checkedList">
      <template #item="{ item, index }">
        <GoodsCard
          :data="item.data"
          :order-info="item.orderInfo"
          :show-add-btn="false"
          @click="() => handleClickCard(index)"
        />
      </template>

      <template #right="{ index }">
        <Button
          style="height: 100%"
          square
          text="删除"
          @click="() => removeFromCart(index)"
          type="danger"
        />
      </template>
    </ActionList>

    <SubmitBar
      class="submit-bar"
      :price="orderState.price * 100"
      button-text="立即下单"
      @submit="showCreateForm"
    >
      <div>
        <p>已选{{ checkedList.length }}件</p>
        <p class="infotext">优惠立减:￥{{ orderState.discount }}</p>
      </div>

      <template #tip> 您有新的优惠券未领取, <span @click="showCoupon">查看优惠券</span> </template>
    </SubmitBar>

    <GoodsOptionForm
      v-model:visible="optionFormState.visible"
      :data="list[optionFormState.listIndex]?.data"
      :order-info="list[optionFormState.listIndex]?.orderInfo"
      @submit="submitOption"
    />

    <Popup v-model:show="createInfoState.visible" round position="bottom" class="create-info-popup">
      <CreateInfoForm v-model="createInfoState.data" />
      <div class="info-btns">
        <Button class="btn" @click="createInfoState.visible = false">取消</Button>
        <Button class="btn" @click="onSubmit" type="primary">提交订单</Button>
      </div>
    </Popup>
  </div>
</template>
<script setup lang="ts">
import { insertOrder, type Order } from '@/api/modules/order';
import { getProductList, type Product } from '@/api/modules/product';
import { getSetsList, type Sets } from '@/api/modules/sets';
import { ORDER_DETAIL_TYPE, ORDER_TYPE } from '@/common/constant';
import { calculateProductPrice, calculateSetsPrice, checkLoginStatus } from '@/common/function';
import GoodsCard from '@/components/GoodsCard.vue';
import GoodsOptionForm from '@/components/GoodsOptionForm.vue';
import { useCartStore } from '@/stores/cart';
import { Button, SubmitBar, Popup, showSuccessToast, showFailToast } from 'vant';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import CreateInfoForm, { type CreateInfoFormValue } from './components/CreateInfoForm.vue';
import ActionList from '@/components/ActionList.vue';

const cartStore = useCartStore();

const list = ref<
  {
    data: Product.Product | Sets.Sets;
    orderInfo: Pick<Order.DetailInsertParam, 'chooseOption' | 'quantity'>;
  }[]
>([]);

const checkedList = ref<number[]>([]);

const router = useRouter();

const createInfoState = reactive<{
  visible: boolean;
  data: CreateInfoFormValue;
}>({
  visible: false,
  data: {
    orderType: ORDER_TYPE.IN_SHOP,
    expectTime: Date.now().toString(),
    note: '',
  },
});

const optionFormState = reactive<{
  visible: boolean;
  listIndex: number;
}>({
  visible: false,
  listIndex: 0,
});

const orderState = reactive<{
  price: number;
  discount: string;
}>({
  price: 0,
  discount: '0.00',
});

watch([checkedList, () => cartStore.orderDetailList], calculatePrice, {
  deep: true,
});

/** 计算总价 */
function calculatePrice() {
  const selectList = checkedList.value.map((index) => list.value[index]);
  let price = 0,
    oPrice = 0;
  selectList.forEach((item) => {
    const type = 'amount' in item.data;
    const { price: itemP, originalPrice: itemOP } = type
      ? calculateSetsPrice(item.data as Sets.Sets, item.orderInfo.chooseOption)
      : calculateProductPrice(item.data as Product.Product, item.orderInfo.chooseOption[0]);
    price += itemP * item.orderInfo.quantity;
    oPrice += itemOP * item.orderInfo.quantity;
  });

  orderState.price = price;
  orderState.discount = (oPrice - price).toFixed(2);
}

/** 点击商品卡片 */
function handleClickCard(index: number) {
  optionFormState.listIndex = index;
  optionFormState.visible = true;
}

/** 表单提交 */
function submitOption(params: Order.DetailInsertParam) {
  // 更新全局购物车数据
  cartStore.remove(optionFormState.listIndex);
  cartStore.add(params);
}

/** 移出购物车 */
function removeFromCart(index: number) {
  cartStore.remove(index);
}

/** 订单信息 */
function showCreateForm() {
  checkLoginStatus()
    .then(() => {
      if (checkedList.value.length === 0) {
        showFailToast('您还没有选择商品哦！');
      } else {
        createInfoState.visible = true;
      }
    })
    .catch((toLogin) => {
      if (toLogin) {
        router.push('/login');
      }
    });
}

/** 提交订单 */
function onSubmit() {
  insertOrder({
    couponIds: [],
    note: createInfoState.data?.note,
    orderType: createInfoState.data?.orderType,
    expectTime: createInfoState.data?.expectTime,
    items: checkedList.value.map((index) => cartStore.orderDetailList[index]),
  }).then(({ data }) => {
    showSuccessToast('订单创建成功！');
    cartStore.remove(checkedList.value);
    router.push(`/order_detail?id=${data.id}`);
  });
}

/** 展示优惠券 */
function showCoupon() {
  console.log('展示优惠券');
}

/** 获取列表数据 */
async function getListData() {
  const pIds: number[] = [],
    sIds: number[] = [];
  cartStore.orderDetailList.forEach((item) => {
    if (item.type === ORDER_DETAIL_TYPE.PRODUCT) {
      pIds.push(item.targetId);
    } else if (item.type === ORDER_DETAIL_TYPE.SETS) {
      sIds.push(item.targetId);
    }
  });

  const { data: pData } = await getProductList({
    ids: pIds,
  });

  const { data: sData } = await getSetsList({
    ids: sIds,
  });

  list.value = cartStore.orderDetailList.map((item) => {
    let resultData;
    if (item.type === ORDER_DETAIL_TYPE.PRODUCT) {
      resultData = pData.list.find((p) => p.id === item.targetId);
    } else {
      resultData = sData.list.find((s) => s.id === item.targetId);
    }
    return {
      data: resultData!,
      orderInfo: {
        quantity: item.quantity,
        chooseOption: item.chooseOption,
      },
    };
  });
}

watch(() => cartStore.orderDetailList, getListData, { immediate: true, deep: true });
</script>
<style scoped>
.cart-page {
  .swipe-cell {
    margin: 0.5rem;
    border-radius: 0.5rem;
    background-color: #fff;
  }
  .card-checkbox {
    display: flex;
  }
  .delete-button {
    height: 100%;
  }
  .create-info-popup {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: end;
    .info-btns {
      display: flex;
      justify-content: space-between;

      .btn {
        width: 40%;
      }
    }
  }
}
</style>
