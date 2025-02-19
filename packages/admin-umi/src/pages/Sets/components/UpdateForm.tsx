import { COUPON_TYPE, PRODUCT_STATUS } from '@/common/constant';
import { formatToChildren } from '@/common/util';
import UploadFileField from '@/components/UploadFileField';
import { Category, Product, Sets } from '@/types';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormField,
  ProFormDigit,
  ProFormCascader,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { useRef } from 'react';

type Props = {
  onFinish: (formData: FormParam) => Promise<boolean | void>;
  modalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
  currentRow?: Sets.Sets;
  productList: Product.Product[];
  categoryList: Category.Category[];
};

/** 表单项参数 */
type FormParam = {
  update_name: string;
  update_avatar: string;
  update_categoryId: number[];
  update_description: string;
  update_type: COUPON_TYPE;
  update_amount: number;
  update_productIds: number[];
  update_status: PRODUCT_STATUS;
};

const Form: React.FC<Props> = (props) => {
  /** 表单实例 */
  const modalRef = useRef<FormInstance>();
  /** categoryId表单值 */
  const category = props.categoryList.find((c) => c.id === props.currentRow?.categoryId);
  return (
    <ModalForm<FormParam>
      title={'修改套装信息'}
      width="400px"
      initialValues={
        {
          update_name: props.currentRow?.name,
          update_avatar: props.currentRow?.avatar,
          update_description: props.currentRow?.description,
          update_status: props.currentRow?.status,
          update_categoryId: category?.parentId ? [category.parentId, category.id] : [category?.id],
          update_type: props.currentRow?.type,
          update_amount: props.currentRow?.amount,
          update_productIds: props.currentRow?.products.map((p) => p.id),
        } as FormParam
      }
      open={props.modalOpen}
      modalProps={{ destroyOnClose: true }}
      formRef={modalRef}
      onFinish={props.onFinish}
      onOpenChange={props.handleOpenChange}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '套装名称为必填项',
          },
          {
            max: 16,
            message: '长度不能超过16个字符！',
          },
        ]}
        label="套装名称"
        tooltip="最长为 16 位"
        placeholder="请输入名称"
        name="update_name"
      />
      <ProFormTextArea
        rules={[
          {
            required: true,
            message: '套装描述为必填项',
          },
          {
            max: 255,
            message: '长度不能超过255个字符！',
          },
        ]}
        label="套装描述"
        tooltip="最长为 255 位"
        placeholder="请输入描述"
        name="update_description"
      />
      <ProFormCascader
        name="update_categoryId"
        rules={[
          {
            required: true,
            message: '产品类别为必填项',
          },
        ]}
        label="产品类别"
        fieldProps={{
          options: formatToChildren(props.categoryList),
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        }}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '套装状态为必填项',
          },
        ]}
        valueEnum={{
          [PRODUCT_STATUS.ON]: {
            text: '启用',
            color: 'green',
          },
          [PRODUCT_STATUS.OFF]: {
            text: '停用',
            color: 'gray',
          },
        }}
        name="update_status"
        label="套装状态"
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '套装折扣类型为必填项',
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
        label="套装折扣类型"
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
        }}
      />
      <ProFormField
        rules={[
          {
            required: true,
            message: '套装图像为必填项',
          },
        ]}
        name="update_avatar"
        label="套装图像"
      >
        <UploadFileField
          onChange={(fileList) => {
            modalRef.current?.setFieldValue('update_avatar', fileList[0]?.url);
          }}
          fieldProps={{
            listType: 'picture',
            maxCount: 1,
          }}
          initialList={props.currentRow && [props.currentRow.avatar]}
        />
      </ProFormField>
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
