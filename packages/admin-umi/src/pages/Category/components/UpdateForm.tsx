import { ModalForm, ProFormField, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { useRef } from 'react';
import { Category } from '@/types';
import UploadFileField from '@/components/UploadFileField';

type Props = {
  onFinish: (formData: UpdateFormParam) => Promise<boolean | void>;
  modalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
  currentRow: Category.Category | undefined;
  categoryList: Category.Category[];
};

/** 表单项参数 */
type UpdateFormParam = {
  update_name?: string;
  update_avatar?: string;
  update_parentId?: number;
};

const UpdateForm: React.FC<Props> = (props) => {
  /** 表单实例 */
  const modalRef = useRef<FormInstance>();

  return (
    <ModalForm<UpdateFormParam>
      title={'修改信息'}
      width="400px"
      modalProps={{
        destroyOnClose: true,
      }}
      initialValues={
        {
          update_name: props.currentRow?.name,
          update_avatar: props.currentRow?.avatar,
          update_parentId: props.currentRow?.parentId || undefined,
        } as UpdateFormParam
      }
      open={props.modalOpen}
      formRef={modalRef}
      onFinish={props.onFinish}
      onOpenChange={props.handleOpenChange}
    >
      <ProFormText
        rules={[
          {
            max: 16,
            message: '长度不能超过16个字符！',
          },
        ]}
        label="类别名称"
        tooltip="最长为 16 位"
        placeholder="请输入名称"
        name="update_name"
      />
      <ProFormField name="update_avatar" label="类别图像">
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
        options={props.categoryList}
        fieldProps={{
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        }}
        name="update_parentId"
        label="父类别"
      />
    </ModalForm>
  );
};

export default UpdateForm;
