<template>
  <Popup
    v-model:show="visible"
    round
    @open="handlePopupOpen"
    position="bottom"
    :style="{ height: '50%' }"
  >
    <Card
      :price="finalPrice.price"
      :desc="props.data?.description"
      :title="props.data?.name"
      :thumb="props.data?.avatar"
      :origin-price="finalPrice.originalPrice"
    />
    <Form ref="optionChooseFormRef">
      <Field
        v-for="(product, index) in (props.data as Sets.Sets).products || [props.data]"
        :key="product.id"
        :rules="[
          {
            required: true,
            message: '请选择产品选项！',
          },
        ]"
        required
        name="chooseOption"
        label="选项"
      >
        <template #input>
          <RadioGroup v-model="formState.chooseOption[index]">
            <Radio
              style="padding: 0.2rem 0"
              v-for="option in product?.options"
              :key="option.id"
              :name="option.id"
            >
              {{ option.name }}
            </Radio>
          </RadioGroup>
        </template>
      </Field>
      <Field required name="quantity" label="数量">
        <template #input>
          <Stepper v-model="formState.quantity" />
        </template>
      </Field>
      <SubmitBar
        :price="finalPrice.totalPrice * 100"
        :button-text="isUpdate ? '提交修改' : '加入购物车'"
        @submit="handleSubmit"
      />
    </Form>
  </Popup>
</template>
<script setup lang="ts">
import type { Order } from '@/api/modules/order';
import type { Product } from '@/api/modules/product';
import type { Sets } from '@/api/modules/sets';
import { ORDER_DETAIL_TYPE } from '@/common/constant';
import { calculateProductPrice, calculateSetsPrice } from '@/common/function';
import { deepCompare } from '@/common/util';
import {
  SubmitBar,
  Field,
  Form,
  Popup,
  Radio,
  RadioGroup,
  Stepper,
  Card,
  type FormInstance,
  showFailToast,
} from 'vant';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';

type Data = Product.Product | Sets.Sets;

type FormParams = Pick<Order.OrderDetail, 'chooseOption' | 'quantity'>;

type Props = {
  data?: Data;
  orderInfo?: FormParams;
};

const props = defineProps<Props>();

/** 数据的类型 */
const dataRawType = computed(() => {
  if (!props.data) {
    return undefined;
  }
  if ('amount' in props.data) {
    return ORDER_DETAIL_TYPE.SETS;
  } else {
    return ORDER_DETAIL_TYPE.PRODUCT;
  }
});

/** 区分是加入购物车还是已经在购物车里 */
const isUpdate = computed(
  () => !!props.orderInfo?.chooseOption && props.orderInfo.chooseOption.length > 0,
);

/** 表单弹窗的显隐 */
const visible = defineModel('visible', {
  default: false,
  type: Boolean,
});

const formState = reactive<FormParams>({
  quantity: 1,
  chooseOption: [],
});

const formRef = useTemplateRef<FormInstance>('optionChooseFormRef');

const emit = defineEmits<{
  submit: [param: Order.DetailInsertParam];
}>();

/** 计算最终提交价格 */
const finalPrice = ref<{ price: number; originalPrice: number; totalPrice: number }>({
  price: 0,
  originalPrice: 0,
  totalPrice: 0,
});
watch(
  () => formState,
  async () => {
    let result = {
      price: 0,
      originalPrice: 0,
    };

    try {
      if (dataRawType.value === ORDER_DETAIL_TYPE.PRODUCT) {
        result = calculateProductPrice(props.data as Product.Product, formState.chooseOption[0]);
      } else if (dataRawType.value === ORDER_DETAIL_TYPE.SETS) {
        result = calculateSetsPrice(props.data as Sets.Sets, formState.chooseOption);
      }
    } catch {
      showFailToast('数据异常，请刷新页面！');
    }
    finalPrice.value = {
      ...result,
      totalPrice: result.price * formState.quantity,
    };
  },
  {
    deep: true,
  },
);

/** 处理选项表单提交 */
function handleSubmit() {
  formRef.value?.validate().then(() => {
    /** 如果数据没变化不触发提交 */
    if (!deepCompare(formState, props.orderInfo)) {
      emit('submit', {
        quantity: formState.quantity,
        chooseOption: formState.chooseOption!,
        targetId: props.data!.id,
        type: dataRawType.value!,
      });
    }

    visible.value = false;
  });
}

/** 当产品选项弹框打开，初始化数据 */
function handlePopupOpen() {
  let products: Product.Product[] = [];

  if (dataRawType.value === ORDER_DETAIL_TYPE.SETS) {
    products = (props.data as Sets.Sets).products;
  } else {
    products = [props.data as Product.Product];
  }

  formState.chooseOption = props.orderInfo?.chooseOption ?? products.map((p) => p.options[0].id);
  formState.quantity = props.orderInfo?.quantity ?? 1;
}
</script>
<style scoped></style>
