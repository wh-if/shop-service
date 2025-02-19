import { Footer } from '@/components';
import { getAuthCode, login } from '@/services/auth';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { history, useModel, Helmet } from '@umijs/max';
import { App, Tabs } from 'antd';
import Settings from '../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import { Auth } from '@/types';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const handleSubmit = async (values: Auth.LoginParams) => {
    // 登录
    const result = await login({
      ...values,
    });
    if (result) {
      const defaultLoginSuccessMessage = '登录成功！';
      localStorage.setItem('access_token', result.data.access_token);
      localStorage.setItem('refresh_token', result.data.refresh_token);
      message.success(defaultLoginSuccessMessage);
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: result.data.userInfo,
        }));
      });
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    }
  };
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
          onFinish={async (values) => {
            await handleSubmit(values as Auth.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '密码登录',
              },
              {
                key: 'mobile',
                label: '验证码登录',
              },
            ]}
          />

          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined />,
            }}
            name="telNumber"
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
            ]}
          />

          {type === 'account' && (
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="请输入密码！"
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          )}

          {type === 'mobile' && (
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder="请输入验证码！"
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'秒后重新获取'}`;
                }
                return '获取验证码';
              }}
              name="authcode"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              phoneName="telNumber"
              onGetCaptcha={async (telNumber: string) => {
                const result = await getAuthCode(telNumber);
                if (!result) {
                  return;
                }
                message.success('获取验证码成功！验证码为：' + result.data.code);
              }}
            />
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default () => (
  <App>
    <Login />
  </App>
);
