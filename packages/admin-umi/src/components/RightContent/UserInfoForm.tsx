import { USER_ROLE, USER_STATUS } from '@/common/constant';
import { getAuthCode } from '@/services/auth';
import { updateUser } from '@/services/user';
import { ModalForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { App, Avatar, Badge, FormInstance, List, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import UploadFileField from '../UploadFileField';

type Props = {
  modalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
};

type FormState = {
  visible: boolean;
  type: 'name' | 'password';
};

type ModalFormParam = {
  update_name?: string;
  update_password?: string;
  update_authcode?: string;
};

const UserInfoForm: React.FC<Props> = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { message } = App.useApp();
  const [formState, setFormState] = useState<FormState>({
    visible: false,
    type: 'name',
  });
  const updateFormRef = useRef<FormInstance>();

  async function refreshUserInfo() {
    const userinfo = await initialState?.fetchUserInfo!();
    setInitialState({ ...initialState, currentUser: userinfo });
  }

  const renderUserStatus = (status: USER_STATUS) => {
    let label: string, color: string;

    switch (status) {
      case USER_STATUS.ON:
        label = '正常';
        color = 'green';
        break;
      case USER_STATUS.OFF:
        label = '禁用';
        color = 'red';
        break;
      case USER_STATUS.REMOVED:
        label = '注销';
        color = 'gray';
        break;
    }
    return <Badge color={color} text={label} />;
  };

  return (
    <Modal
      title="个人信息"
      footer={null}
      onCancel={() => props.handleOpenChange(false)}
      open={props.modalOpen}
    >
      <List itemLayout="horizontal">
        <List.Item
          actions={[
            <UploadFileField
              key="upload"
              fieldProps={{
                showUploadList: false,
                maxCount: 1,
              }}
              onChange={async (fileList) => {
                await updateUser({
                  avatar: fileList[0].url,
                });
                refreshUserInfo();
              }}
            >
              <a key="avatar">修改</a>
            </UploadFileField>,
          ]}
          style={{ padding: '25px 0' }}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                size={'large'}
                src={
                  initialState?.currentUser?.avatar && `/api${initialState?.currentUser?.avatar}`
                }
              >
                {initialState?.currentUser?.name[0].toUpperCase()}
              </Avatar>
            }
          />
        </List.Item>
        <List.Item>
          <List.Item.Meta title="ID" description={initialState?.currentUser?.id} />
        </List.Item>
        <List.Item
          actions={[
            <a
              key="edit"
              onClick={() => {
                setFormState({
                  visible: true,
                  type: 'name',
                });
              }}
            >
              修改
            </a>,
          ]}
        >
          <List.Item.Meta title="用户名" description={initialState?.currentUser?.name} />
        </List.Item>
        <List.Item>
          <List.Item.Meta title="手机号码" description={initialState?.currentUser?.telNumber} />
        </List.Item>
        <List.Item
          actions={[
            <a
              key="edit"
              onClick={() => {
                setFormState({
                  visible: true,
                  type: 'password',
                });
              }}
            >
              修改
            </a>,
          ]}
        >
          <List.Item.Meta title="密码" description="*************" />
        </List.Item>
        <List.Item>
          <List.Item.Meta
            title="用户状态"
            description={renderUserStatus(initialState!.currentUser!.status)}
          />
        </List.Item>
        <List.Item>
          <List.Item.Meta
            title="角色"
            description={initialState?.currentUser?.roles.map((i) => (
              <Tag key={i} color={i === USER_ROLE.ADMIN ? 'blue' : 'green'}>
                {i}
              </Tag>
            ))}
          />
        </List.Item>
      </List>
      <ModalForm<ModalFormParam>
        open={formState.visible}
        width={400}
        title="用户信息修改"
        formRef={updateFormRef}
        onFinish={async (formData) => {
          const hide = message.loading('修改中');
          if (formState.type === 'name') {
            await updateUser({
              name: formData.update_name,
            });
          } else {
            await updateUser({
              password: formData.update_password,
              authcode: formData.update_authcode,
            });
          }

          hide();
          message.success('修改成功！');
          updateFormRef.current?.resetFields();
          setFormState((state) => ({ ...state, visible: false }));

          refreshUserInfo();
        }}
        onOpenChange={(visible) => setFormState((state) => ({ ...state, visible }))}
      >
        {formState.type === 'name' ? (
          <ProFormText
            name="update_name"
            label="用户名"
            initialValue={initialState?.currentUser?.name}
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
              {
                max: 20,
                message: '长度不能超过20个字符！',
              },
            ]}
            tooltip="最长为 20 位"
            placeholder="请输入用户名"
          />
        ) : (
          <>
            <ProFormText.Password
              name="update_password"
              label="密码"
              placeholder="请输入密码！"
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="update_password_again"
              placeholder="请再次输入密码！"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
                {
                  validator(_, value) {
                    if (
                      !value ||
                      updateFormRef.current?.getFieldValue('update_password') === value
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入密码不一致，请重新确认！'));
                  },
                },
              ]}
            />
            <ProFormText
              initialValue={initialState?.currentUser?.telNumber}
              name="update_telNumber"
              disabled
              label="手机号码"
            />
            <ProFormCaptcha
              placeholder="请输入验证码！"
              label="验证码"
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'秒后重新获取'}`;
                }
                return '获取验证码';
              }}
              name="update_authcode"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              phoneName="update_telNumber"
              onGetCaptcha={async (telNumber: string) => {
                const result = await getAuthCode(telNumber);
                if (!result) {
                  return;
                }
                message.success('获取验证码成功！验证码为：' + result.data.code);
              }}
            />
          </>
        )}
      </ModalForm>
    </Modal>
  );
};

export default UserInfoForm;
