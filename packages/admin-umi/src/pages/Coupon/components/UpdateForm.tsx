import { COUPON_STATUS, COUPON_TARGET, COUPON_TYPE } from '@/common/constant';
import { Coupon, Product } from '@/types';
import {
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormDateRangePicker,
  ProFormDigit,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { useRef } from 'react';

type Props = {
  onFinish: (formData: FormParam) => Promise<boolean | void>;
  modalOpen: boolean;
  isCreate: boolean;
  handleOpenChange: (visible: boolean) => void;
  currentRow?: Coupon.Coupon;
  productList: Product.Product[];
};

/** 表单项参数 */
type FormParam = {
  update_type: COUPON_TYPE;
  update_needFull: number;
  update_amount: number;
  update_receiveLimit: number;
  update_totalQuantity: number;
  update_remainingQuantity: number;
  update_status: COUPON_STATUS;
  update_target: COUPON_TARGET;
  update_description: string;
  update_dateRange: [string, string];
  update_productIds: number[];
};

const Form: React.FC<Props> = (props) => {
  /** 表单实例 */
  const modalRef = useRef<FormInstance>();
  return (
    <ModalForm<FormParam>
      title={props.isCreate ? '新建优惠券' : '修改优惠券信息'}
      width="400px"
      initialValues={
        props.isCreate
          ? {}
          : ({
              update_type: props.currentRow?.type,
              update_needFull: props.currentRow?.needFull,
              update_amount: props.currentRow?.amount,
              update_receiveLimit: props.currentRow?.receiveLimit,
              update_totalQuantity: props.currentRow?.totalQuantity,
              update_remainingQuantity: props.currentRow?.remainingQuantity,
              update_status: props.currentRow?.status,
              update_target: props.currentRow?.target,
              update_dateRange: [props.currentRow?.startDate, props.currentRow?.endDate],
              update_description: props.currentRow?.description,
              update_productIds: props.currentRow?.products.map((p) => p.id),
            } as FormParam)
      }
      open={props.modalOpen}
      modalProps={{ destroyOnClose: true }}
      formRef={modalRef}
      onFinish={props.onFinish}
      onOpenChange={props.handleOpenChange}
    >
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '优惠券折扣类型为必填项',
          },
        ]}
        valueEnum={{
          [COUPON_TYPE.CUT]: {
            text: '减固定金额',
            color: 'green',
          },
          [COUPON_TYPE.PERCENTAGE]: {
            text: '按百分比减',
            color: 'red',
          },
        }}
        name="update_type"
        label="折扣类型"
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '折扣条件为必填项',
          },
        ]}
        name="update_needFull"
        label="折扣条件"
        fieldProps={{
          min: 0,
        }}
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '折扣量为必填项',
          },
        ]}
        name="update_amount"
        label="折扣量"
        fieldProps={{
          precision: 2,
          min: 0,
        }}
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '单用户领取量为必填项',
          },
        ]}
        initialValue={1}
        name="update_receiveLimit"
        label="单用户领取量"
        fieldProps={{
          min: 0,
        }}
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '总量为必填项',
          },
        ]}
        name="update_totalQuantity"
        label="总量"
        fieldProps={{
          min: 0,
        }}
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '剩余量为必填项',
          },
        ]}
        name="update_remainingQuantity"
        label="剩余量"
        fieldProps={{
          min: 0,
        }}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '优惠券状态为必填项',
          },
        ]}
        valueEnum={{
          [COUPON_STATUS.ON]: {
            text: '启用',
            color: 'green',
          },
          [COUPON_STATUS.OFF]: {
            text: '停用',
            color: 'gray',
          },
        }}
        name="update_status"
        label="优惠券状态"
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '优惠券目标对象为必填项',
          },
        ]}
        valueEnum={{
          [COUPON_TARGET.ORDER]: {
            text: '订单',
            color: 'blue',
          },
          [COUPON_TARGET.PRODUCT]: {
            text: '产品',
            color: 'orange',
          },
        }}
        name="update_target"
        label="目标对象"
      />

      <ProFormDateRangePicker
        rules={[
          {
            required: true,
            message: '持续时间为必填项',
          },
        ]}
        name="update_dateRange"
        label="持续时间"
      />
      <ProFormTextArea
        rules={[
          {
            required: true,
            message: '优惠券描述为必填项',
          },
          {
            max: 255,
            message: '长度不能超过255个字符！',
          },
        ]}
        label="优惠券描述"
        tooltip="最长为 255 位"
        placeholder="请输入描述"
        name="update_description"
      />
      <ProFormSelect
        mode="multiple"
        rules={[
          {
            required: true,
            message: '包含产品为必填项',
          },
        ]}
        fieldProps={{
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        }}
        options={props.productList.map((p) => ({ id: p.id, name: p.name }))}
        name="update_productIds"
        label="包含产品"
      />
    </ModalForm>
  );
};

export default Form;
