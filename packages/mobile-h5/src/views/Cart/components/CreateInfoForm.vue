<template>
  <Form>
    <Field :disabled="props.disabled" name="orderType" label="订单类型">
      <template #input>
        <RadioGroup direction="horizontal" :disabled="props.disabled" v-model="formValue.orderType">
          <Radio :name="ORDER_TYPE.IN_SHOP">{{ ORDER_TYPE_LABEL[ORDER_TYPE.IN_SHOP] }}</Radio>
          <Radio :name="ORDER_TYPE.USER_SELF">{{ ORDER_TYPE_LABEL[ORDER_TYPE.USER_SELF] }}</Radio>
        </RadioGroup>
      </template>
    </Field>
    <Field
      name="expectTime"
      :disabled="props.disabled"
      :model-value="expectTimeLabel"
      @click="showDateTimePicker"
      label="期望时间"
    />
    <Field
      v-model="formValue.note"
      :disabled="props.disabled"
      name="note"
      type="textarea"
      label="备注"
    />
    <Dialog
      v-model:show="dateTimePickerValue.dialogVisible"
      title="选择期望时间"
      show-confirm-button
      :show-cancel-button="true"
      @confirm="onConfirm"
    >
      <PickerGroup :show-toolbar="false" :tabs="['选择日期', '选择时间']">
        <DatePicker v-model="dateTimePickerValue.date" />
        <TimePicker v-model="dateTimePickerValue.time" />
      </PickerGroup>
    </Dialog>
  </Form>
</template>
<script setup lang="ts">
import { ORDER_TYPE } from '@/common/constant';
import { Form, Field, PickerGroup, RadioGroup, Radio, DatePicker, TimePicker, Dialog } from 'vant';
import { computed, reactive } from 'vue';
import dayjs from 'dayjs';
import { ORDER_TYPE_LABEL } from '@/common/constantLabel';

export type CreateInfoFormValue = {
  orderType: ORDER_TYPE;
  expectTime: string;
  note: string;
};

type DateTimePickerValue = {
  date: [string, string, string];
  time: [string, string];
  dialogVisible: boolean;
};

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});

const nowDate = dayjs();
const formValue = defineModel<CreateInfoFormValue>({
  required: true,
});

const expectTimeLabel = computed(() =>
  dayjs(parseInt(formValue.value.expectTime)).format('YYYY-MM-DD HH:mm'),
);

/** TODO 预约日期限制 */
const dateTimePickerValue = reactive<DateTimePickerValue>({
  dialogVisible: false,
  date: [nowDate.year().toString(), (nowDate.month() + 1).toString(), nowDate.date().toString()],
  time: [nowDate.hour().toString(), nowDate.minute().toString()],
});

function showDateTimePicker() {
  if (!props.disabled) {
    dateTimePickerValue.dialogVisible = true;
  }
}

function onConfirm() {
  const timeArr = [...dateTimePickerValue.date, ...dateTimePickerValue.time].map((item) =>
    parseInt(item),
  );
  formValue.value.expectTime = new Date(
    timeArr[0],
    timeArr[1] - 1,
    timeArr[2],
    timeArr[3],
    timeArr[4],
  )
    .getTime()
    .toString();
}
</script>
<style scoped></style>
