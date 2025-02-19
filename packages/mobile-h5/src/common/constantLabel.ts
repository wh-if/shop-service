import { ORDER_STATUS, ORDER_TYPE, PAY_TYPE } from './constant';

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.WAIT_PAY]: '等待支付',
  [ORDER_STATUS.WAIT_HANDLE]: '等待处理',
  [ORDER_STATUS.HANDLING]: '处理中',
  [ORDER_STATUS.FINISHED]: '已完成',
  [ORDER_STATUS.CANCEL]: '取消',
  [ORDER_STATUS.REMOVED]: '用户删除',
};

export const ORDER_TYPE_LABEL = {
  [ORDER_TYPE.IN_SHOP]: '到店使用',
  [ORDER_TYPE.USER_SELF]: '打包自取',
};

export const PAY_TYPE_LABEL = {
  [PAY_TYPE.DEAFULT]: '默认',
};
