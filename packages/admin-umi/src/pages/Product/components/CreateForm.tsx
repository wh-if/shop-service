import { PRODUCT_STATUS } from '@/common/constant';
import { formatToChildren } from '@/common/util';
import UploadFileField from '@/components/UploadFileField';
import { Category } from '@/types';
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
};

/** 表单项参数 */
type FormParam = {
  create_name: string;
  create_avatar: string;
  create_categoryId: number[];
  create_status: PRODUCT_STATUS;
  create_description: string;
  create_pictures: string[];
};

const Form: React.FC<Props> = (props) => {
  /** 表单实例 */
  const modalRef = useRef<FormInstance>();
  return (
    <ModalForm<FormParam>
      title={'新建产品'}
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
        name="create_name"
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
        name="create_status"
        label="产品状态"
      />
      <ProFormField
        rules={[
          {
            required: true,
            message: '产品图像为必填项',
          },
        ]}
        name="create_avatar"
        label="产品图像"
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
      <ProFormField
        rules={[
          {
            required: true,
            message: '产品图片为必填项',
          },
        ]}
        name="create_pictures"
        label="产品图片"
      >
        <UploadFileField
          onChange={(fileList) => {
            modalRef.current?.setFieldValue(
              'create_pictures',
              fileList.map((f) => f.url),
            );
          }}
          fieldProps={{
            listType: 'picture-card',
            maxCount: 5,
          }}
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
