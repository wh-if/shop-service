import { PRODUCT_STATUS } from '@/common/constant';
import { formatToChildren } from '@/common/util';
import UploadFileField from '@/components/UploadFileField';
import { Category, Product } from '@/types';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormCascader,
  ProFormField,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { useRef } from 'react';

type Props = {
  onFinish: (formData: FormParam) => Promise<boolean | void>;
  modalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
  categoryList: Category.Category[];
  currentRow?: Product.Product;
};

/** 表单项参数 */
type FormParam = {
  update_name: string;
  update_avatar: string;
  update_categoryId: number[];
  update_status: PRODUCT_STATUS;
  update_description: string;
  update_pictures: string[];
};

const Form: React.FC<Props> = (props) => {
  /** 表单实例 */
  const modalRef = useRef<FormInstance>();
  /** categoryId表单值 */
  const category = props.categoryList.find((c) => c.id === props.currentRow?.categoryId);
  return (
    <ModalForm<FormParam>
      title={'修改产品信息'}
      width="400px"
      initialValues={
        {
          update_name: props.currentRow?.name,
          update_avatar: props.currentRow?.avatar,
          update_categoryId: category?.parentId ? [category.parentId, category.id] : [category?.id],
          update_status: props.currentRow?.status,
          update_description: props.currentRow?.description,
          update_pictures: props.currentRow?.pictures,
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
            message: '产品名称为必填项',
          },
          {
            max: 32,
            message: '长度不能超过32个字符！',
          },
        ]}
        label="产品名称"
        tooltip="最长为 32 位"
        placeholder="请输入名称"
        name="update_name"
      />
      <ProFormTextArea
        rules={[
          {
            required: true,
            message: '产品描述为必填项',
          },
          {
            max: 255,
            message: '长度不能超过255个字符！',
          },
        ]}
        label="产品描述"
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
            message: '产品状态为必填项',
          },
        ]}
        valueEnum={{
          [PRODUCT_STATUS.ON]: {
            text: '上架',
            color: 'green',
          },
          [PRODUCT_STATUS.OFF]: {
            text: '下架',
            color: 'red',
          },
        }}
        name="update_status"
        label="产品状态"
      />
      <ProFormField
        rules={[
          {
            required: true,
            message: '产品图像为必填项',
          },
        ]}
        name="update_avatar"
        label="产品图像"
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
      <ProFormField
        rules={[
          {
            required: true,
            message: '产品图片为必填项',
          },
        ]}
        name="update_pictures"
        label="产品图片"
      >
        <UploadFileField
          onChange={(fileList) => {
            modalRef.current?.setFieldValue(
              'update_pictures',
              fileList.map((f) => f.url),
            );
          }}
          fieldProps={{
            listType: 'picture-card',
            maxCount: 5,
          }}
          initialList={props.currentRow?.pictures}
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </button>
        </UploadFileField>
      </ProFormField>
    </ModalForm>
  );
};

export default Form;
