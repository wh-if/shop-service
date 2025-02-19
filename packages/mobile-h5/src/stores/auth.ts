import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { refreshToken, type Auth } from '@/api/modules/auth';

export const useAuthStore = defineStore('auth', () => {
  /** 登录信息 */
  const state = ref<Auth.LoginResult>();

  /** 登录 */
  function loginAction(data: Auth.LoginResult) {
    state.value = data;
  }

  /** 退出登录 */
  function logoutAction() {
    state.value = undefined;
  }

  /** 登录状态 */
  const hasLogin = computed(() => !!state.value?.access_token);

  /** 更新token */
  async function updateToken() {
    const { data } = await refreshToken();
    if (state.value) {
      state.value.access_token = data.access_token;
      state.value.refresh_token = data.refresh_token;
    }
  }

  return { state, hasLogin, loginAction, logoutAction, updateToken };
});
