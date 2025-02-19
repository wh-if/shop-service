import { getAuthCode } from '@/services/auth';
import { checkTelNumber } from '@/services/user';
import { ModalForm, ProFormText, ProFormCaptcha } from '@ant-design/pro-components';
import { App, FormInstance } from 'antd';
import { useRef } from 'react';

type Props = {
  onFinish: (formData: CreateFormParam) => Promise<boolean | void>;
  createModalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
};

/** 表单项参数 */
type CreateFormParam = {
  create_name: string;
  create_password: string;
  create_telNumber: string;
  create_authcode: string;
};

const CreateUserForm: React.FC<Props> = (props) => {
  /** 表单实例 */
  const createModalRef = useRef<FormInstance>();
  const { message } = App.useApp();
  return (
    <ModalForm<CreateFormParam>
      title={'新建用户'}
      width="400px"
      open={props.createModalOpen}
      formRef={createModalRef}
      onFinish={props.onFinish}
      onOpenChange={props.handleOpenChange}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '用户名称为必填项',
          },
          {
            max: 20,
            message: '长度不能超过20个字符！',
          },
        ]}
        label="用户名称"
        tooltip="最长为 20 位"
        placeholder="请输入名称"
        name="create_name"
      />
      <ProFormText
        name="create_telNumber"
        label="手机号码"
        placeholder="请输入手机号！"
        rules={[
          {
            required: true,
            message: '手机号是必填项！',
          },
          {
            pattern: /^1\d{10}$/,
            message: '不合法的手机号！',
          },
          {
            async validator(rule, value) {
              if (!/^1\d{10}$/.test(value)) {
                return;
              }
              const { data } = await checkTelNumber(value);
              if (data.hasRegister) {
                return Promise.reject('当前号码已被注册，请更换手机号码！');
              }
              return Promise.resolve();
            },
          },
        ]}
      />

      <ProFormText.Password
        name="create_password"
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
        name="create_password_again"
        placeholder="请再次输入密码！"
        label="确认密码"
        rules={[
          {
            required: true,
            message: '密码是必填项！',
          },
          {
            validator(_, value) {
              if (!value || createModalRef.current?.getFieldValue('create_password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入密码不一致，请重新确认！'));
            },
          },
        ]}
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
        name="create_authcode"
        rules={[
          {
            required: true,
            message: '验证码是必填项！',
          },
        ]}
        phoneName="create_telNumber"
        onGetCaptcha={async (telNumber: string) => {
          const result = await getAuthCode(telNumber);
          if (!result) {
            return;
          }
          message.success('获取验证码成功！验证码为：' + result.data.code);
        }}
      />
    </ModalForm>
  );
};

export default CreateUserForm;
