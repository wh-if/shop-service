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
import React, { useEffect, useRef, useState } from 'react';
import { Product, Coupon } from '@/types';
import { deleteCoupon, getCouponList, insertCoupon, updateCoupon } from '@/services/coupon';
import CouponUpdateForm from './components/UpdateForm';
import { toLocaleString } from '@/common/util';
import { COUPON_STATUS, COUPON_TARGET, COUPON_TYPE, PRODUCT_STATUS } from '@/common/constant';
import { getProductList } from '@/services/product';

const CouponManage: React.FC = () => {
  /** 添加项弹窗 */
  const [modalIsCreate, setModalIsCreate] = useState<boolean>(true);

  /** 修改项弹窗 */
  const [modalOpen, handleModalOpen] = useState<boolean>(false);

  /** 详情展示弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<Coupon.Coupon>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<Coupon.Coupon[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 产品的数据 */
  const [productList, setProductList] = useState<Product.Product[]>([]);
  useEffect(() => {
    getProductList({ status: [PRODUCT_STATUS.ON] }).then(({ data }) => {
      setProductList(data.list);
    });
  }, []);

  /** 添加项 */
  const handleAdd = async (fields: Coupon.InsertParam) => {
    const hide = message.loading('正在添加');
    try {
      await insertCoupon({
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
  const handleUpdate = async (fields: Coupon.UpdateParam) => {
    const hide = message.loading('修改中');
    try {
      await updateCoupon({
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
  const handleRemove = async (selectedRows: Coupon.Coupon[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteCoupon(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<Coupon.Coupon>[] = [
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
      title: '折扣条件',
      dataIndex: 'needFull',
      valueType: 'text',
      hideInSearch: true,
      renderText: (text) => `满${text}`,
    },
    {
      title: '折扣量',
      dataIndex: 'amount',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '单用户领取量',
      dataIndex: 'receiveLimit',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '作用对象',
      dataIndex: 'target',
      valueEnum: {
        [COUPON_TARGET.ORDER]: {
          text: '订单',
          color: 'blue',
        },
        [COUPON_TARGET.PRODUCT]: {
          text: '产品',
          color: 'orange',
        },
      },
    },
    {
      title: '总量',
      dataIndex: 'totalQuantity',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '剩余量',
      dataIndex: 'remainingQuantity',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        [COUPON_STATUS.ON]: {
          text: '启用',
          color: 'green',
        },
        [COUPON_STATUS.OFF]: {
          text: '停用',
          color: 'gray',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '开始日期',
      sorter: true,
      dataIndex: 'startDate',
      valueType: 'dateRange',
      render: (_, row) => toLocaleString(row.startDate, 'toLocaleDateString'),
    },
    {
      title: '结束日期',
      sorter: true,
      dataIndex: 'endDate',
      valueType: 'dateRange',
      render: (_, row) => toLocaleString(row.endDate, 'toLocaleDateString'),
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createDate',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.createDate),
    },
    {
      title: '最后更新时间',
      sorter: true,
      dataIndex: 'updateDate',
      valueType: 'dateTimeRange',
      render: (_, row) => toLocaleString(row.updateDate),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setModalIsCreate(false);
            handleModalOpen(true);
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
      <ProTable<Coupon.Coupon, Coupon.ListQueryParam>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: true }}
        dateFormatter="number"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalIsCreate(true);
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
          const { data } = await getCouponList(
            {
              id: params.id,
              type: [params.type as string],
              target: [params.target as string],
              startDate: params.startDate,
              endDate: params.endDate,
              createDate: params.createDate,
              updateDate: params.updateDate,
              status: [params.status as string],
              orderBy: orderBy as Coupon.ListQueryParam['orderBy'],
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
                        <Tag key={item.id}>{item.id}</Tag>
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
        {currentRow?.id && (
          <ProDescriptions<Coupon.Coupon>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<Coupon.Coupon>[]}
          />
        )}
      </Drawer>
      <CouponUpdateForm
        productList={productList}
        onFinish={async (value) => {
          const values: Coupon.InsertParam = {
            needFull: value.update_needFull,
            receiveLimit: value.update_receiveLimit,
            target: value.update_target,
            totalQuantity: value.update_totalQuantity,
            remainingQuantity: value.update_remainingQuantity,
            status: value.update_status,
            description: value.update_description,
            amount: value.update_amount,
            type: value.update_type,
            startDate: new Date(value.update_dateRange[0]).getTime().toString(),
            endDate: new Date(value.update_dateRange[1]).getTime().toString(),
            productIds: value.update_productIds,
          };
          const success = modalIsCreate
            ? await handleAdd(values)
            : await handleUpdate({
                id: currentRow!.id,
                ...values,
              });
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        currentRow={currentRow}
        isCreate={modalIsCreate}
        modalOpen={modalOpen}
        handleOpenChange={handleModalOpen}
      />
    </PageContainer>
  );
};
export default () => (
  <App>
    <CouponManage />
  </App>
);
