import { USER_ROLE, USER_STATUS } from '@/common/constant';
import { User } from '@/types';
import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { useRef } from 'react';

type Props = {
  onFinish: (formData: UpdateFormParam) => Promise<boolean | void>;
  modalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
  currentRow?: User.DetailResult;
};

/** 表单项参数 */
type UpdateFormParam = {
  update_roles?: USER_ROLE[];
  update_status?: USER_STATUS;
};

const UserUpdateForm: React.FC<Props> = (props) => {
  /** 表单实例 */
  const createModalRef = useRef<FormInstance>();

  return (
    <ModalForm<UpdateFormParam>
      title={'修改信息'}
      width="400px"
      modalProps={{
        destroyOnClose: true,
      }}
      open={props.modalOpen}
      initialValues={
        {
          update_roles: props.currentRow?.roles,
          update_status: props.currentRow?.status,
        } as UpdateFormParam
      }
      formRef={createModalRef}
      onFinish={props.onFinish}
      onOpenChange={props.handleOpenChange}
    >
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '用户角色为必填项',
          },
        ]}
        label="用户角色"
        placeholder="请选择角色"
        mode="multiple"
        name="update_roles"
        options={[
          { value: USER_ROLE.ADMIN, label: '管理员' },
          { value: USER_ROLE.USER, label: '普通用户' },
        ]}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '账号状态为必填项',
          },
        ]}
        label="账号状态"
        placeholder="请选择账号状态"
        name="update_status"
        options={[
          { value: USER_STATUS.ON, label: '正常' },
          { value: USER_STATUS.OFF, label: '禁用' },
          { value: USER_STATUS.REMOVED, label: '注销' },
        ]}
      />
    </ModalForm>
  );
};

export default UserUpdateForm;
