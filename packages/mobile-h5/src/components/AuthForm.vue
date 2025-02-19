<template>
  <Form ref="authForm">
    <Field
      v-if="props.showTel"
      v-model="formState.telNumber"
      name="telNumber"
      label="手机号码"
      placeholder="手机号码"
      clearable
      :rules="[
        { required: true, message: '请填写手机号码' },
        { validator: (value) => validateChinesePhone(value), message: '手机号码格式不正确！' },
      ]"
    />
    <Field
      v-model="formState.authcode"
      name="authcode"
      label="验证码"
      clearable
      placeholder="验证码"
      :rules="[{ required: true, message: '请填写验证码' }]"
    >
      <template #button>
        <Button v-if="!hasSend" @click="sendAuthCode" :disabled="hasSend" size="small">
          发送验证码
        </Button>
        <CountDown
          v-else
          ref="countDownRef"
          :time="60 * 1000"
          @finish="hasSend = false"
          format="ss"
        >
          <template #default="timeData"> {{ timeData.seconds }}s后重新获取 </template>
        </CountDown>
      </template>
    </Field>
  </Form>
</template>
<script setup lang="ts">
import { getAuthCode, type Auth } from '@/api/modules/auth';
import {
  showSuccessToast,
  type CountDownInstance,
  type FormInstance,
  Form,
  Field,
  CountDown,
  Button,
} from 'vant';
import { reactive, ref, toRaw, useTemplateRef, watch } from 'vue';
import { validateChinesePhone } from '@/common/util';

const props = withDefaults(
  defineProps<{
    showTel?: boolean;
  }>(),
  {
    showTel: true,
  },
);

const modelValue = defineModel();

const fromRef = useTemplateRef<FormInstance>('authForm');
const countDownRef = useTemplateRef<CountDownInstance>('countDownRef');
const formState = reactive<Auth.LoginParams>({
  telNumber: '',
});

watch(
  () => formState,
  () => {
    modelValue.value = toRaw(formState);
  },
  {
    deep: true,
  },
);

// 是否已发送验证码
const hasSend = ref(false);

// 发送验证码
async function sendAuthCode() {
  if (props.showTel) {
    await fromRef.value?.validate('telNumber');
  }
  countDownRef.value?.start();
  hasSend.value = true;
  const { data } = await getAuthCode(props.showTel ? formState.telNumber : undefined);
  showSuccessToast(`获取验证码成功！验证码为：${data.code}`);
}

defineExpose<Pick<FormInstance, 'validate'>>({
  validate: (name) => fromRef.value!.validate(name),
});
</script>
<style scoped></style>
