import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormDigit, ProFormText, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { App, Button, Tag, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { Product } from '@/types';
import { deleteProductOption, insertProductOption, updateProductOption } from '@/services/product';

type Props = {
  modalOpen: boolean;
  handleOpenChange: (visible: boolean) => void;
  getData: () => Promise<Product.Product>;
};

const OptionTable: React.FC<Props> = (props) => {
  /** 添加项弹窗 */
  const [modalOpen, handleModalOpen] = useState<boolean>(false);

  /** 弹窗分类 */
  const [modalIsCreate, changeModalIsCreate] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<Product.ProductOption>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<Product.ProductOption[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 产品信息 */
  const [product, setProduct] = useState<Product.Product>();

  /** 添加项 */
  const handleAdd = async (fields: Product.OptionInsertParam) => {
    const hide = message.loading('正在添加');
    try {
      await insertProductOption({
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
  const handleUpdate = async (fields: Product.OptionUpdateParam) => {
    const hide = message.loading('修改中');
    try {
      await updateProductOption({
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
  const handleRemove = async (selectedRows: Product.ProductOption[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteProductOption(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<Product.ProductOption>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      title: '选项名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '优惠价格',
      dataIndex: 'price',
      valueType: 'textarea',
    },
    {
      title: '原价',
      dataIndex: 'originalPrice',
      valueType: 'textarea',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            handleModalOpen(true);
            changeModalIsCreate(false);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
      ],
    },
  ];

  return (
    <Modal
      destroyOnClose={true}
      open={props.modalOpen}
      footer={(_, { CancelBtn }) => {
        return (
          <>
            {selectedRowsState?.length > 0
              ? [
                  <Button
                    key="delete"
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
                  </Button>,
                ]
              : []}
            <CancelBtn></CancelBtn>
          </>
        );
      }}
      onCancel={() => props.handleOpenChange(false)}
    >
      <ProTable<Product.ProductOption>
        headerTitle={'产品选项'}
        actionRef={actionRef}
        rowKey="id"
        pagination={false}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
              changeModalIsCreate(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async () => {
          const p = await props.getData();
          setProduct(p);
          return {
            data: p.options,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <ModalForm<Product.ProductOption>
        title={modalIsCreate ? '新建产品选项' : '修改选项信息'}
        open={modalOpen}
        modalProps={{
          destroyOnClose: true,
        }}
        width={400}
        onOpenChange={handleModalOpen}
        initialValues={
          modalIsCreate
            ? {}
            : ({
                name: currentRow?.name,
                price: currentRow?.price,
                originalPrice: currentRow?.originalPrice,
              } as Product.ProductOption)
        }
        onFinish={async (value) => {
          let success: boolean;
          if (modalIsCreate) {
            success = await handleAdd({
              productId: product!.id,
              name: value.name,
              price: value.price,
              originalPrice: value.originalPrice,
            });
          } else {
            success = await handleUpdate({
              id: currentRow!.id,
              name: value.name,
              price: value.price,
              originalPrice: value.originalPrice,
            });
          }

          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '产品选项名称为必填项',
            },
            {
              max: 16,
              message: '长度不能超过16个字符！',
            },
          ]}
          label="产品名称"
          tooltip="最长为 16 位"
          placeholder="请输入产品名称"
          name="name"
        />
        <ProFormDigit
          rules={
            modalIsCreate
              ? [
                  {
                    required: true,
                    message: '优惠价格为必填项',
                  },
                ]
              : []
          }
          fieldProps={{
            precision: 2,
          }}
          label="优惠价格"
          placeholder="请输入优惠价格"
          name="price"
        />
        <ProFormDigit
          rules={
            modalIsCreate
              ? [
                  {
                    required: true,
                    message: '原始价格为必填项',
                  },
                ]
              : []
          }
          fieldProps={{
            precision: 2,
          }}
          label="原始价格"
          placeholder="请输入原始价格"
          name="originalPrice"
        />
      </ModalForm>
    </Modal>
  );
};
export default OptionTable;
