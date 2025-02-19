import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { App, Avatar, Button, Drawer, Tag, Image } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Category, Product } from '@/types';
import {
  deleteProduct,
  getProductInfo,
  getProductList,
  insertProduct,
  updateProduct,
} from '@/services/product';
import ProductCreateForm from './components/CreateForm';
import ProductUpdateForm from './components/UpdateForm';
import { formatToChildren, toLocaleString } from '@/common/util';
import { getCategoryList } from '@/services/category';
import { PRODUCT_STATUS } from '@/common/constant';
import OptionTable from './components/OptionTable';

const ProductManage: React.FC = () => {
  /** 添加项弹窗 */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  /** 修改项弹窗 */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  /** 详情展示弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 选项表格弹窗 */
  const [optionTableOpen, setOptionTableOpen] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<Product.Product>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<Product.Product[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 产品类别的数据 */
  const [categoryList, setCategoryList] = useState<Category.Category[]>([]);
  useEffect(() => {
    getCategoryList().then(({ data }) => {
      setCategoryList(data.list);
    });
  }, []);

  /** 添加项 */
  const handleAdd = async (fields: Product.InsertParam) => {
    const hide = message.loading('正在添加');
    try {
      await insertProduct({
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
  const handleUpdate = async (fields: Product.UpdateParam) => {
    const hide = message.loading('修改中');
    try {
      await updateProduct({
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
  const handleRemove = async (selectedRows: Product.Product[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteProduct(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<Product.Product>[] = [
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
      title: '产品名称',
      dataIndex: 'name',
      valueType: 'textarea',
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
      title: '产品状态',
      dataIndex: 'status',
      valueEnum: {
        [PRODUCT_STATUS.ON]: {
          text: '上架',
          color: 'green',
        },
        [PRODUCT_STATUS.OFF]: {
          text: '下架',
          color: 'red',
        },
      },
    },
    {
      title: '产品描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
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
      title: '图片',
      dataIndex: 'pictures',
      hideInSearch: true,
      hideInTable: true,
      render: (_, record) => {
        return record.pictures.map((p) => <Image key={p} width={50} src={'/api' + p} />);
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
      title: '最后更新时间',
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
          key="options"
          onClick={() => {
            setOptionTableOpen(true);
            setCurrentRow(record);
          }}
        >
          选项
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
      <ProTable<Product.Product, Product.ListQueryParam>
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
          const { data } = await getProductList(
            {
              id: params.id,
              name: params.name,
              categoryId: params.categoryId,
              status: params.status,
              createTime: params.createTime,
              updateTime: params.updateTime,
              orderBy: orderBy as Product.ListQueryParam['orderBy'],
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
          <ProDescriptions<Product.Product>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<Product.Product>[]}
          />
        )}
      </Drawer>
      <ProductCreateForm
        categoryList={categoryList}
        onFinish={async (value) => {
          const success = await handleAdd({
            name: value.create_name,
            avatar: value.create_avatar,
            categoryId: value.create_categoryId.pop()!,
            status: value.create_status,
            description: value.create_description,
            pictures: value.create_pictures,
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
      <ProductUpdateForm
        onFinish={async (value) => {
          const success = await handleUpdate({
            id: currentRow!.id,
            name: value.update_name,
            avatar: value.update_avatar,
            categoryId: value.update_categoryId.pop()!,
            status: value.update_status,
            description: value.update_description,
            pictures: value.update_pictures,
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
        categoryList={categoryList}
      />
      <OptionTable
        modalOpen={optionTableOpen}
        handleOpenChange={(visible) => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
          setOptionTableOpen(visible);
        }}
        getData={async () => {
          const { data } = await getProductInfo(currentRow!.id);
          return data;
        }}
      />
    </PageContainer>
  );
};
export default () => (
  <App>
    <ProductManage />
  </App>
);
