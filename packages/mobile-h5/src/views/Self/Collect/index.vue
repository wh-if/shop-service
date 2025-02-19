<template>
  <div class="page-content">
    <ActionList
      class="list"
      v-model="checkState.checkedList"
      :list="list"
      :check-visible="checkState.visible"
    />
    <div class="tool-bar">
      <Checkbox v-show="isEdit" style="flex: 2" icon-size="small" v-model="checkState.checkAll"
        >全选</Checkbox
      >
      <Button
        style="flex: 1"
        size="small"
        :type="isEdit ? 'default' : 'primary'"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? '取消' : '编辑' }}
      </Button>
      <Button v-show="isEdit" style="flex: 2" size="small" type="danger">取消收藏</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getCollectList, type Collect } from '@/api/modules/collect';
import ActionList from '@/components/ActionList.vue';
import { Checkbox, Button } from 'vant';
import { onMounted, reactive, ref } from 'vue';

type CheckState = {
  visible: boolean;
  checkedList: number[];
  checkAll: boolean;
};

const checkState = reactive<CheckState>({
  visible: false,
  checkedList: [],
  checkAll: false,
});

const list = ref<Collect.ResultWithTarget[]>([]);

const isEdit = ref(false);

async function getListData() {
  const { data } = await getCollectList();
  list.value = data.list;
}

onMounted(() => {
  getListData();
});
</script>
<style scoped>
.page-content {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  font-size: small;
}
.list {
  flex: 1;
}

.tool-bar {
  padding: 0.5rem;

  display: flex;
  justify-content: space-between;
  gap: 1rem;

  .edit-btn {
    transition: flex 0.5s ease;
  }
}
</style>
