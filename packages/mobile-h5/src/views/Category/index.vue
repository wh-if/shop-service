<template>
  <div class="page-content">
    <Sidebar class="category-list" @change="handleCategoryChange" v-model="activeBarState.index">
      <SidebarItem v-for="c in parentCategoryList" :key="c.id" :title="c.name" />
    </Sidebar>

    <div class="main-list">
      <Divider>套装</Divider>
      <GoodsCard
        v-for="sets in activeBarState.setsList"
        :key="'s' + sets.id"
        :data="sets"
        @click="handleAdd"
      />
      <Divider>单品</Divider>

      <GoodsCard
        v-for="p in activeBarState.productList"
        :key="'p' + p.id"
        :data="p"
        @click="handleAdd"
      />
    </div>
    <GoodsOptionForm
      :data="optionChooseState.targetData"
      @submit="submitToCart"
      v-model:visible="optionChooseState.visible"
    />
  </div>
</template>
<script setup lang="ts">
import { getCategoryList, type Category } from '@/api/modules/category';
import type { Order } from '@/api/modules/order';
import { getProductList, type Product } from '@/api/modules/product';
import { getSetsList, type Sets } from '@/api/modules/sets';
import { ORDER_DETAIL_TYPE, PRODUCT_STATUS } from '@/common/constant';
import GoodsCard from '@/components/GoodsCard.vue';
import GoodsOptionForm from '@/components/GoodsOptionForm.vue';
import { useCartStore } from '@/stores/cart';
import { Sidebar, SidebarItem, Divider, showSuccessToast } from 'vant';
import { computed, onMounted, reactive, ref, shallowReactive } from 'vue';

/** 类别列表 */
const categoryList = ref<Category.Category[]>([]);
const parentCategoryList = computed(() => categoryList.value.filter((c) => c.parentId === 0));

/** 当前选中的类别 */
type ActiveBarState = {
  index: number;
  productList: Product.Product[];
  setsList: Sets.Sets[];
};
const activeBarState = shallowReactive<ActiveBarState>({
  index: 0,
  productList: [],
  setsList: [],
});

const cartStore = useCartStore();

/** 添加时选择产品选项 */
type OptionChooseState = {
  targetData?: Product.Product | Sets.Sets;
  visible: boolean;
  type: ORDER_DETAIL_TYPE;
};

const optionChooseState = reactive<OptionChooseState>({
  targetData: undefined,
  visible: false,
  type: ORDER_DETAIL_TYPE.PRODUCT,
});

/** 处理类别切换 */
async function handleCategoryChange(index: number) {
  const { data: productData } = await getProductList({
    categoryId: [parentCategoryList.value[index].id],
    status: [PRODUCT_STATUS.ON],
  });

  const { data: setsData } = await getSetsList({
    categoryId: [parentCategoryList.value[index].id],
    status: [PRODUCT_STATUS.ON],
  });

  activeBarState.productList = productData.list;
  activeBarState.setsList = setsData.list;
}

/** 点击添加按钮 */
function handleAdd(p: OptionChooseState['targetData'], type: ORDER_DETAIL_TYPE) {
  optionChooseState.targetData = p;
  optionChooseState.type = type;
  optionChooseState.visible = true;
}

/** 提交选项表单 */
function submitToCart(param: Order.DetailInsertParam) {
  cartStore.add(param);
  showSuccessToast('添加购物车成功！');
}

onMounted(async () => {
  const { data } = await getCategoryList();
  categoryList.value = data.list;
});
</script>
<style scoped>
.page-content {
  display: flex;
  height: 100vh;
  overflow: hidden;
  .category-list {
    width: 5rem;
    overflow-y: scroll;
  }

  .main-list {
    flex: 1;
    overflow-y: scroll;
  }
}
</style>
