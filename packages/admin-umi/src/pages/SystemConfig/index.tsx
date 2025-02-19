import {
  getSystemConfigList,
  insertSystemConfig,
  updateSystemConfig,
} from '@/services/systemConfig';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Button, Divider, FormInstance } from 'antd';
import { useEffect, useRef, useState } from 'react';

type BasicState = {
  edit: boolean;
  id?: number;
  form: {
    name: string;
    description: string;
  };
};

const SystemConfig: React.FC = () => {
  const { message } = App.useApp();

  const [basicState, setBasicState] = useState<BasicState>({
    edit: false,
    form: {
      name: '',
      description: '',
    },
  });
  const basicFormRef = useRef<FormInstance>();

  function initData() {
    getSystemConfigList().then(({ data }) => {
      data.list.forEach((item) => {
        if (item.key === 'basic') {
          const data = item.value as BasicState['form'];
          setBasicState((state) => ({
            ...state,
            form: { ...data },
            id: item.id,
          }));
          basicFormRef.current?.setFieldsValue({ ...data });
        }
      });
    });
  }

  useEffect(() => {
    initData();
  }, []);

  return (
    <PageContainer>
      <ProCard>
        <Divider orientation="left" orientationMargin={0}>
          基本信息
          <Button
            onClick={() => {
              setBasicState((state) => ({ ...state, edit: !state.edit }));
            }}
            type="link"
          >
            {basicState.edit && '退出'}修改
          </Button>
        </Divider>
        <ProForm<BasicState['form']>
          submitter={basicState.edit && undefined}
          initialValues={basicState.form}
          formRef={basicFormRef}
          onFinish={async (formData) => {
            const id = basicState.id;

            const hide = message.loading('修改中');
            if (!!id) {
              await updateSystemConfig({
                id,
                value: formData,
              });
            } else {
              const { data } = await insertSystemConfig({
                key: 'basic',
                value: formData,
              });
              setBasicState((state) => ({ ...state, id: (data as Array<any>)[0].id }));
            }
            hide();
            message.success('修改成功！');
            setBasicState((state) => ({ ...state, edit: false, form: { ...formData } }));
          }}
          readonly={!basicState.edit}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '商店名称不能为空！',
              },
            ]}
            width="md"
            name="name"
            label="商店名称"
          />
          <ProFormTextArea
            rules={[
              {
                required: true,
                message: '商店描述不能为空！',
              },
            ]}
            width="xl"
            name="description"
            label="描述"
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default () => (
  <App>
    <SystemConfig />
  </App>
);
