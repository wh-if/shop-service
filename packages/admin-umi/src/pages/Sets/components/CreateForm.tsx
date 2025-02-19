import { COUPON_TYPE, PRODUCT_STATUS } from '@/common/constant';
import { formatToChildren } from '@/common/util';
import UploadFileField from '@/components/UploadFileField';
import { Category, Product } from '@/types';
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
  productList: Product.Product[];
  categoryList: Category.Category[];
};

/** 表单项参数 */
type FormParam = {
  create_name: string;
  create_avatar: string;
  create_description: string;
  create_type: COUPON_TYPE;
  create_amount: number;
  create_productIds: number[];
  create_categoryId: number[];
  create_status: PRODUCT_STATUS;
};

const Form: React.FC<Props> = (props) => {
  /** 表单实例 */
  const modalRef = useRef<FormInstance>();
  return (
    <ModalForm<FormParam>
      title={'新建套装'}
      width="400px"
      open={props.modalOpen}
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
        name="create_name"
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
        name="create_description"
      />
      <ProFormCascader
        name="create_categoryId"
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
        name="create_status"
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
        name="create_type"
        label="套装折扣类型"
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '折扣量为必填项',
          },
        ]}
        name="create_amount"
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
        name="create_avatar"
        label="套装图像"
      >
        <UploadFileField
          onChange={(fileList) => {
            modalRef.current?.setFieldValue('create_avatar', fileList[0]?.url);
          }}
          fieldProps={{
            listType: 'picture',
            maxCount: 1,
          }}
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
        name="create_productIds"
        label="包含产品"
      />
    </ModalForm>
  );
};

export default Form;
