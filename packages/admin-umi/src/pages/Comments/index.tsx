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
import { App, Image, Button, Drawer, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { Comments } from '@/types';
import { deleteComments, getCommentsList, updateCommentsStatus } from '@/services/comments';
import { toLocaleString } from '@/common/util';
import { COMMENTS_STATUS } from '@/common/constant';
import { history } from '@umijs/max';

const CommentsManage: React.FC = () => {
  /** 详情展示弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 表格实例 */
  const actionRef = useRef<ActionType>();

  /** 表格实例 */
  const formRef = useRef<ProFormInstance>();

  /** 当前行/项 */
  const [currentRow, setCurrentRow] = useState<Comments.Comments>();

  /** 选中的行/项 */
  const [selectedRowsState, setSelectedRows] = useState<Comments.Comments[]>([]);

  /** 消息, 弹窗 */
  const { message, modal } = App.useApp();

  /** 修改项 */
  const handleUpdate = async (fields: Comments.UpdateStatusParam) => {
    const hide = message.loading('修改中');
    try {
      await updateCommentsStatus({
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
  const handleRemove = async (selectedRows: Comments.Comments[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteComments(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<Comments.Comments>[] = [
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
      title: '父级评论',
      dataIndex: 'parentId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              formRef.current?.setFieldValue('id', entity.parentId);
              formRef.current?.submit();
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '用户ID',
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
      title: '订单ID',
      dataIndex: 'orderId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              history.push('/user', { id: entity.orderId });
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '评论状态',
      dataIndex: 'status',
      valueEnum: {
        [COMMENTS_STATUS.APPROVED]: {
          text: '审核通过',
          color: 'green',
        },
        [COMMENTS_STATUS.PENDING]: {
          text: '等待审核',
          color: 'blue',
        },
        [COMMENTS_STATUS.REJECTED]: {
          text: '审核不通过',
          color: 'red',
        },
      },
    },
    {
      title: '评分',
      dataIndex: 'star',
      valueType: 'digitRange',
      fieldProps: {
        min: 0,
        max: 5,
        step: 0.5,
      },
      render: (_, record) => record.star,
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
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
  ];

  return (
    <PageContainer>
      <ProTable<Comments.Comments, Comments.ListQueryParam>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        dateFormatter="number"
        request={async (params, sort) => {
          const orderEntry = Object.entries(sort);
          let orderBy, order;
          if (orderEntry.length > 0) {
            orderBy = orderEntry[0][0];
            order = orderEntry[0][1];
          }
          const { data } = await getCommentsList(
            {
              id: params.id,
              parentId: params.parentId && [params.parentId as number],
              orderId: params.orderId && [params.orderId as number],
              userId: params.userId && [params.userId as number],
              star: params.star,
              status: [params.status as string],
              createTime: params.createTime,
              updateTime: params.updateTime,
              orderBy: orderBy as Comments.ListQueryParam['orderBy'],
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
          <Button
            onClick={async () => {
              await handleUpdate({
                ids: selectedRowsState.map((i) => i.id),
                status: COMMENTS_STATUS.REJECTED,
              });

              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            color="default"
          >
            拒绝通过
          </Button>
          <Button
            onClick={async () => {
              await handleUpdate({
                ids: selectedRowsState.map((i) => i.id),
                status: COMMENTS_STATUS.APPROVED,
              });
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            type="primary"
          >
            审核通过
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
        {currentRow?.id && (
          <ProDescriptions<Comments.Comments>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<Comments.Comments>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default () => (
  <App>
    <CommentsManage />
  </App>
);
