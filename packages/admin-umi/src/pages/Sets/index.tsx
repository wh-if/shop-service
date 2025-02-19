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
import React, { useEffect, useRef, useState } from 'react';
import { Category, Product, Sets } from '@/types';
import { deleteSets, getSetsList, insertSets, updateSets } from '@/services/sets';
import SetsCreateForm from './components/CreateForm';
import SetsUpdateForm from './components/UpdateForm';
import { formatToChildren, toLocaleString } from '@/common/util';
import { COUPON_TYPE, PRODUCT_STATUS } from '@/common/constant';
import { getProductList } from '@/services/product';
import { getCategoryList } from '@/services/category';

const SetsManage: React.FC = () => {
  /** 添加项弹窗 */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  /** 修改项弹窗 */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  /** 详情展示弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<Sets.Sets>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<Sets.Sets[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 产品类别的数据 */
  const [categoryList, setCategoryList] = useState<Category.Category[]>([]);
  useEffect(() => {
    getCategoryList().then(({ data }) => {
      setCategoryList(data.list);
    });
  }, []);

  /** 产品的数据 */
  const [productList, setProductList] = useState<Product.Product[]>([]);
  useEffect(() => {
    getProductList({ status: [PRODUCT_STATUS.ON] }).then(({ data }) => {
      setProductList(data.list);
    });
  }, []);

  /** 添加项 */
  const handleAdd = async (fields: Sets.InsertParam) => {
    const hide = message.loading('正在添加');
    try {
      await insertSets({
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
  const handleUpdate = async (fields: Sets.UpdateParam) => {
    const hide = message.loading('修改中');
    try {
      await updateSets({
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
  const handleRemove = async (selectedRows: Sets.Sets[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteSets(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<Sets.Sets>[] = [
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
      title: '套装名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '类别名称',
      dataIndex: 'categoryId',
      valueType: 'cascader',
      fieldProps: {
        options: formatToChildren(categoryList),
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
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
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '折扣类型',
      dataIndex: 'type',
      valueEnum: {
        [COUPON_TYPE.CUT]: {
          text: '减固定金额',
          color: 'green',
        },
        [COUPON_TYPE.PERCENTAGE]: {
          text: '按百分比减',
          color: 'red',
        },
      },
    },
    {
      title: '折扣量',
      dataIndex: 'amount',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        [PRODUCT_STATUS.ON]: {
          text: '启用',
          color: 'green',
        },
        [PRODUCT_STATUS.OFF]: {
          text: '停用',
          color: 'gray',
        },
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.createTime),
    },
    {
      title: '最后修改时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.updateTime),
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
      <ProTable<Sets.Sets, Sets.ListQueryParam>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
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
          const { data } = await getSetsList(
            {
              id: params.id,
              name: params.name,
              status: [params.status as string],
              categoryId: params.categoryId,
              createTime: params.createTime,
              updateTime: params.updateTime,
              type: [params.type as string],
              orderBy: orderBy as Sets.ListQueryParam['orderBy'],
              order: order === 'ascend' ? 'ASC' : 'DESC',
            },
            {
              page: params.current!,
              pageSize: params.pageSize!,
            },
          );

          return {
            data: data.list,
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
        width={800}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<Sets.Sets>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<Sets.Sets>[]}
          />
        )}
      </Drawer>
      <SetsCreateForm
        productList={productList}
        categoryList={categoryList}
        onFinish={async (value) => {
          const success = await handleAdd({
            name: value.create_name,
            avatar: value.create_avatar,
            description: value.create_description,
            categoryId: value.create_categoryId.pop()!,
            amount: value.create_amount,
            type: value.create_type,
            status: value.create_status,
            productIds: value.create_productIds,
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
      <SetsUpdateForm
        productList={productList}
        categoryList={categoryList}
        onFinish={async (value) => {
          const success = await handleUpdate({
            id: currentRow!.id,
            name: value.update_name,
            avatar: value.update_avatar,
            description: value.update_description,
            categoryId: value.update_categoryId.pop()!,
            amount: value.update_amount,
            type: value.update_type,
            status: value.update_status,
            productIds: value.update_productIds,
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
    <SetsManage />
  </App>
);
