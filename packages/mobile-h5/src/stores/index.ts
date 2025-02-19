import { createPinia } from 'pinia';
import { watch } from 'vue';

const pinia = createPinia();

const storagedState = JSON.parse(localStorage.getItem('__PINIA_STATE__') || '{}');
pinia.state.value = storagedState;

watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem('__PINIA_STATE__', JSON.stringify(state));
  },
  { deep: true },
);

export default pinia;
