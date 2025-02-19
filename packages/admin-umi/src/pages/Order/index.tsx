import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { App, Button, Drawer, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { Order } from '@/types';
import { deleteOrder, getOrderList, updateOrderStatus } from '@/services/order';
import { toLocaleString } from '@/common/util';
import { ORDER_STATUS, ORDER_TYPE, PAY_TYPE } from '@/common/constant';
import { history } from '@umijs/max';

const OrderManage: React.FC = () => {
  /** 添加项弹窗 */
  // const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  /** 修改项弹窗 */
  // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  /** 详情展示弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 选项表格弹窗 */
  // const [optionTableOpen, setOptionTableOpen] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<Order.Order>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<Order.Order[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 产品类别的数据 */
  // const [categoryList, setCategoryList] = useState<Category.Category[]>([]);
  // useEffect(() => {
  //   getCategoryList().then(({ data }) => {
  //     setCategoryList(data.list);
  //   });
  // }, []);

  /** 修改项 */
  const handleUpdate = async (fields: Order.UpdateStatusParam) => {
    const hide = message.loading('修改中');
    try {
      await updateOrderStatus({
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
  handleUpdate({});

  /** 删除项 */
  const handleRemove = async (selectedRows: Order.Order[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteOrder(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<Order.Order>[] = [
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
      title: '创建用户',
      dataIndex: 'userId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              history.push('/user', { id: entity.userId });
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      valueEnum: {
        [ORDER_STATUS.FINISHED]: {
          text: '完成',
          color: 'green',
        },
        [ORDER_STATUS.HANDLING]: {
          text: '处理中',
          color: 'orange',
        },
        [ORDER_STATUS.WAIT_PAY]: {
          text: '等待支付',
          color: 'blue',
        },
        [ORDER_STATUS.WAIT_HANDLE]: {
          text: '等待处理',
          color: 'red',
        },
        [ORDER_STATUS.CANCEL]: {
          text: '取消',
          color: 'gray',
        },
        [ORDER_STATUS.REMOVED]: {
          text: '用户删除',
          color: 'gray',
        },
      },
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      valueEnum: {
        [ORDER_TYPE.IN_SHOP]: {
          text: '店内使用',
          color: 'green',
        },
        [ORDER_TYPE.USER_SELF]: {
          text: '用户自取',
          color: 'orange',
        },
      },
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      valueEnum: {
        [PAY_TYPE.DEAFULT]: {
          text: '默认支付',
          color: 'green',
        },
      },
    },
    {
      title: '折扣金额',
      dataIndex: 'payAmount',
      valueType: 'digitRange',
      fieldProps: {
        min: 0,
      },
      render: (_, record) => record.payAmount,
    },
    {
      title: '总金额',
      dataIndex: 'amount',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.createTime),
    },
    {
      title: '支付时间',
      sorter: true,
      dataIndex: 'payTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.payTime),
    },
    {
      title: '用户期望时间',
      sorter: true,
      dataIndex: 'expectTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.expectTime),
    },
    {
      title: '完成时间',
      sorter: true,
      dataIndex: 'finishTime',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.finishTime),
    },
    {
      title: '备注',
      dataIndex: 'note',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setOptionTableOpen(true);
            setCurrentRow(record);
          }}
        >
          订单明细
        </a>,
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
      <ProTable<Order.Order, Order.ListQueryParam>
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
          const { data } = await getOrderList(
            {
              id: params.id,
              name: params.name,
              categoryId: params.categoryId,
              status: params.status,
              createTime: params.createTime,
              updateTime: params.updateTime,
              orderBy: orderBy as Order.ListQueryParam['orderBy'],
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
          <ProDescriptions<Order.Order>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<Order.Order>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default () => (
  <App>
    <OrderManage />
  </App>
);
