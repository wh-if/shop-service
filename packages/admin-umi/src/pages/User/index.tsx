import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { App, Avatar, Button, Drawer, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { User } from '@/types';
import { deleteUser, getUserList, insertUser, updateUser } from '@/services/user';
import { toLocaleString } from '@/common/util';
import { USER_ROLE, USER_STATUS } from '@/common/constant';
import CreateUserForm from './components/CreateForm';
import UpdateUserForm from './components/UpdateForm';
import { useLocation } from '@umijs/max';

const UserManage: React.FC = () => {
  /** 添加项弹窗 */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  /** 修改项弹窗 */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  /** 详情展示弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 表格实例 */
  const formRef = useRef<ProFormInstance>();

  /** 路由导航携带的数据 */
  const location = useLocation();
  useEffect(() => {
    formRef.current?.setFieldValue('id', (location.state as { id: number })?.id);
    formRef.current?.submit();
  });

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<User.DetailResult>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<User.DetailResult[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 添加项 */
  const handleAdd = async (fields: User.InsertParam) => {
    const hide = message.loading('正在添加');
    try {
      await insertUser({
        ...fields,
      });
      hide();
      message.success('添加成功！');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败，请重试！');
      return false;
    }
  };

  /** 修改项 */
  const handleUpdate = async (fields: User.UpdateParam) => {
    const hide = message.loading('修改中');
    try {
      await updateUser({
        ...fields,
      });
      hide();
      message.success('修改成功！');
      return true;
    } catch (error) {
      hide();
      message.error('修改失败，请重试！');
      return false;
    }
  };

  /** 删除项 */
  const handleRemove = async (selectedRows: User.DetailResult[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteUser(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<User.DetailResult>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (text, record) => (
        <Avatar src={record.avatar && '/api' + text}>{record.name[0].toUpperCase()}</Avatar>
      ),
      hideInSearch: true,
    },
    {
      title: '手机号码',
      dataIndex: 'telNumber',
      valueType: 'textarea',
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      valueEnum: {
        [USER_STATUS.ON]: {
          text: '正常',
          color: 'green',
        },
        [USER_STATUS.OFF]: {
          text: '禁用',
          color: 'red',
        },
        [USER_STATUS.REMOVED]: {
          text: '注销',
          color: 'gray',
        },
      },
    },
    {
      title: '用户角色',
      dataIndex: 'roles',
      valueType: 'select',
      render: (_, row) => {
        return row.roles.map((item) => (
          <Tag key={item} color={item === USER_ROLE.ADMIN ? 'blue' : 'green'}>
            {item}
          </Tag>
        ));
      },
      valueEnum: {
        [USER_ROLE.ADMIN]: {
          text: '管理员',
        },
        [USER_ROLE.USER]: {
          text: '普通用户',
        },
      },
    },
    {
      title: '注册时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.createTime),
    },
    {
      title: '最后更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.updateTime),
    },
    {
      title: '最后登录时间',
      sorter: true,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.lastLoginTime),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<User.DetailResult, User.ListQueryParam>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        dateFormatter="number"
        pagination={{
          showQuickJumper: true, // 是否显示快速跳转
          showSizeChanger: true, // 是否显示页面大小选择器
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort) => {
          const orderEntry = Object.entries(sort);
          let orderBy, order;
          if (orderEntry.length > 0) {
            orderBy = orderEntry[0][0];
            order = orderEntry[0][1];
          }
          const result = await getUserList(
            {
              id: params.id,
              name: params.name,
              telNumber: params.telNumber,
              updateTime: params.updateTime,
              createTime: params.createTime,
              lastLoginTime: params.lastLoginTime,
              roles: params.roles,
              status: params.status && [params.status as string],
              orderBy: orderBy as User.ListQueryParam['orderBy'],
              order: order === 'ascend' ? 'ASC' : 'DESC',
            },
            {
              page: params.current!,
              pageSize: params.pageSize!,
            },
          );
          return {
            data: result.data.list,
            total: result.data.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <Button
            onClick={async () => {
              modal.confirm({
                title: '确认删除吗?',
                content: (
                  <>
                    <p>一旦删除将无法恢复，请确认操作。</p>
                    <div>
                      当前选择：
                      {selectedRowsState.map((item) => (
                        <Tag key={item.id}>{item.name}</Tag>
                      ))}
                    </div>
                  </>
                ),
                okText: '是',
                cancelText: '否',
                async onOk() {
                  await handleRemove(selectedRowsState);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                },
              });
            }}
            danger
          >
            删除
          </Button>
        </FooterToolbar>
      )}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<User.DetailResult>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<User.DetailResult>[]}
          />
        )}
      </Drawer>
      <CreateUserForm
        onFinish={async (value) => {
          const success = await handleAdd({
            name: value.create_name,
            password: value.create_password,
            authcode: value.create_authcode,
            telNumber: value.create_telNumber,
          });
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        createModalOpen={createModalOpen}
        handleOpenChange={handleModalOpen}
      />
      <UpdateUserForm
        onFinish={async (value) => {
          const success = await handleUpdate({
            id: currentRow?.id,
            status: value.update_status,
            roles: value.update_roles,
          });
          if (success) {
            handleUpdateModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        currentRow={currentRow}
        modalOpen={updateModalOpen}
        handleOpenChange={handleUpdateModalOpen}
      />
    </PageContainer>
  );
};
export default () => (
  <App>
    <UserManage />
  </App>
);
