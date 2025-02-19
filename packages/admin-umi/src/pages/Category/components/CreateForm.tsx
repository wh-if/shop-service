import UploadFileField from '@/components/UploadFileField';
import { Category } from '@/types';
import { ModalForm, ProFormText, ProFormSelect, ProFormField } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { useRef } from 'react';

type Props = {
  onFinish: (formData: CreateFormParam) => Promise<boolean | void>;
  modalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
  categoryList: Category.Category[];
};

/** 表单项参数 */
type CreateFormParam = {
  create_name: string;
  create_avatar: string;
  create_parentId: number;
};

const CreateForm: React.FC<Props> = (props) => {
  /** 表单实例 */
  const modalRef = useRef<FormInstance>();
  return (
    <ModalForm<CreateFormParam>
      title={'新建类别'}
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
            message: '类别名称为必填项',
          },
          {
            max: 16,
            message: '长度不能超过16个字符！',
          },
        ]}
        label="类别名称"
        tooltip="最长为 16 位"
        placeholder="请输入名称"
        name="create_name"
      />
      <ProFormField name="create_avatar" label="类别图像">
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
        options={props.categoryList}
        fieldProps={{
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        }}
        name="create_parentId"
        label="父类别"
      />
    </ModalForm>
  );
};

export default CreateForm;
