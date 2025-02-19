<template>
  <div class="page-content">
    <div class="auth-form">
      <AuthForm ref="authFormRef" v-model="authFormState" />
      <Button @click="onSubmit" block type="primary"> {{ '登 录' }} </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { login, type Auth } from '@/api/modules/auth';
import AuthForm from '@/components/AuthForm.vue';
import { useAuthStore } from '@/stores/auth';
import { Button, type FormInstance, showSuccessToast } from 'vant';
import { ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const authFormRef = useTemplateRef<FormInstance>('authFormRef');

const authStore = useAuthStore();
const router = useRouter();

const authFormState = ref<Auth.LoginParams>();

async function onSubmit() {
  try {
    await authFormRef.value?.validate();
    const { code, data } = await login({
      telNumber: authFormState.value!.telNumber,
      authcode: authFormState.value!.authcode,
    });
    if (code === 0) {
      authStore.loginAction(data);
      showSuccessToast('登录成功！');
      router.push('home');
    }
  } catch {}
}
</script>
<style scoped>
.page-content {
  height: 100vh;
  padding: 20vh 1rem 0;

  .auth-form {
    padding: 1rem;
    background-color: #fff;
    border-radius: 1rem;

    > * {
      margin-top: 1rem;
    }
  }
}
</style>
