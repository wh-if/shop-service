<template>
  <Card
    class="goods-card"
    :price="resultData.computePrice"
    :origin-price="resultData.computeOriginalPrice"
    :desc="resultData.description"
    :title="resultData.name"
    :thumb="resultData.avatar"
    :num="props.orderInfo?.quantity"
  >
    <template #tags>
      <span v-if="!!resultData.tagText" class="option-info" @click="handleClick">
        {{ resultData.tagText }}
      </span>
    </template>
    <template #footer>
      <slot name="footer">
        <Button
          v-if="props.showAddBtn"
          @click="handleClick"
          :disabled="!resultData.canAdd"
          icon="plus"
          style="padding: 0 0.5rem"
          type="danger"
          size="mini"
        />
      </slot>
    </template>
  </Card>
</template>
<script setup lang="ts">
import type { Product } from '@/api/modules/product';
import type { Sets } from '@/api/modules/sets';
import { calculateProductPrice, calculateSetsPrice } from '@/common/function';
import { computed } from 'vue';
import { Card, Button, showFailToast } from 'vant';
import { ORDER_DETAIL_TYPE } from '@/common/constant';
import type { Order } from '@/api/modules/order';

type Data = Product.Product | Sets.Sets;
type GoodsCardProps = {
  data: Data;
  showAddBtn?: boolean;
  orderInfo?: Pick<Order.OrderDetail, 'quantity' | 'chooseOption'>;
};

type DataExtraParam = {
  canAdd: boolean;
  computePrice?: number;
  computeOriginalPrice?: number;
  tagText?: string;
};

const props = withDefaults(defineProps<GoodsCardProps>(), {
  showAddBtn: true,
});

/** 数据的类型 */
const dataRawType = computed(() => {
  if (props.data && 'amount' in props.data) {
    return ORDER_DETAIL_TYPE.SETS;
  } else {
    return ORDER_DETAIL_TYPE.PRODUCT;
  }
});

const emit = defineEmits<{
  click: [data: Data, type: ORDER_DETAIL_TYPE];
}>();

/** 当点击添加按钮 */
function handleClick() {
  emit('click', props.data, dataRawType.value);
}

/** 计算出展示的数据 */
const resultData = computed<Data & DataExtraParam>(() => {
  if (dataRawType.value === ORDER_DETAIL_TYPE.PRODUCT) {
    const product = props.data as Product.Product;
    const canAdd = product.options.length > 0;

    const result = { ...product, canAdd };

    if (!canAdd) {
      return result;
    }

    try {
      let choosedOption: Product.ProductOption;
      if (!!props.orderInfo) {
        const choosedId = props.orderInfo.chooseOption[0];
        choosedOption = product.options.find((o) => o.id === choosedId)!;
      } else {
        choosedOption = product.options[0];
      }

      const productPrice = calculateProductPrice(product, choosedOption.id);

      return {
        ...result,
        tagText: choosedOption.name,
        computeOriginalPrice: productPrice.originalPrice,
        computePrice: productPrice.price,
      };
    } catch {
      showFailToast('数据异常，请刷新页面！');
      return result;
    }
  } else {
    const sets = props.data as Sets.Sets;
    const canAdd = sets.products.length > 0 && !sets.products.find((p) => p.options.length === 0);

    const result = {
      ...sets,
      canAdd,
    };

    if (!canAdd) {
      return result;
    }

    try {
      let optionIds: number[];
      if (!!props.orderInfo) {
        optionIds = props.orderInfo.chooseOption;
      } else {
        optionIds = sets.products.map((p) => p.options[0].id);
      }

      const setsPrice = calculateSetsPrice(sets, optionIds);

      let tagText = '';
      sets.products.forEach((p, index) => {
        const option = p.options.find((o) => o.id === optionIds[index])!;
        tagText = [tagText, option.name].join('; ');
      });
      return {
        ...result,
        tagText,
        computeOriginalPrice: setsPrice.originalPrice,
        computePrice: setsPrice.price,
      };
    } catch {
      showFailToast('数据异常，请刷新页面！');
      return result;
    }
  }
});
</script>
<style scoped>
.option-info {
  padding: 0.2rem 0.8rem;
  border-radius: 0.2rem;
  background-color: var(--van-gray-3);
}

.goods-card {
  background-color: #fff;
  padding: 0.5rem;
  margin: 0;
  width: 100%;
}
</style>
