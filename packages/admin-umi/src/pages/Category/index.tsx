import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { App, Avatar, Button, Drawer, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { Category } from '@/types';
import {
  deleteCategory,
  getCategoryList,
  insertCategory,
  updateCategory,
} from '@/services/category';
import CategoryCreateForm from './components/CreateForm';
import CategoryUpdateForm from './components/UpdateForm';
import { formatToChildren } from '@/common/util';

export type TableDataType = Category.Category & { children: Category.Category[] };

const CategoryManage: React.FC = () => {
  /** 添加项弹窗 */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  /** 修改项弹窗 */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  /** 详情展示弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<Category.Category>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<Category.Category[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 添加项 */
  const handleAdd = async (fields: Category.InsertParam) => {
    const hide = message.loading('正在添加');
    try {
      await insertCategory({
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
  const handleUpdate = async (fields: Category.UpdateParam) => {
    const hide = message.loading('修改中');
    try {
      await updateCategory({
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
  const handleRemove = async (selectedRows: Category.Category[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteCategory(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<TableDataType>[] = [
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
      title: '类别名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '图像',
      dataIndex: 'avatar',
      render: (text, record) => (
        <Avatar shape="square" src={record.avatar && '/api' + text}>
          {record.name[0].toUpperCase()}
        </Avatar>
      ),
      hideInSearch: true,
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

  /** 格式化的表格数据 */
  const [parentList, setParentList] = useState<Category.Category[]>([]);

  return (
    <PageContainer>
      <ProTable<TableDataType, Category.ListQueryParam>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={false}
        dateFormatter="number"
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
          const { data } = await getCategoryList({
            id: params.id,
            name: params.name,
            parentId: params.parentId,
            orderBy: orderBy as Category.ListQueryParam['orderBy'],
            order: order === 'ascend' ? 'ASC' : 'DESC',
          });

          setParentList(data.list.filter((i) => i.parentId === 0));

          return {
            data: formatToChildren<Category.Category>(data.list),
            total: data.total,
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
          <ProDescriptions<Category.Category>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<Category.Category>[]}
          />
        )}
      </Drawer>
      <CategoryCreateForm
        categoryList={parentList}
        onFinish={async (value) => {
          const success = await handleAdd({
            name: value.create_name,
            avatar: value.create_avatar,
            parentId: value.create_parentId,
          });
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        modalOpen={createModalOpen}
        handleOpenChange={handleModalOpen}
      />
      <CategoryUpdateForm
        onFinish={async (value) => {
          const success = await handleUpdate({
            id: currentRow!.id,
            name: value.update_name,
            avatar: value.update_avatar,
            parentId: value.update_parentId,
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
        categoryList={parentList}
      />
    </PageContainer>
  );
};
export default () => (
  <App>
    <CategoryManage />
  </App>
);
