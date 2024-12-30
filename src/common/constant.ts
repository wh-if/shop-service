/**
 * @prop ADMIN - 管理员
 * @prop USER - 普通用户
 */
export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * @prop ON - 正常
 * @prop OFF - 禁用
 * @prop REMOVED - 注销
 */
export enum USER_STATUS {
  ON = 'on',
  OFF = 'off',
  REMOVED = 'removed',
}

/**
 * @prop ON - 上架
 * @prop OFF - 下架
 */
export enum PRODUCT_STATUS {
  ON = 'on',
  OFF = 'off',
}

/**
 * @prop OFF - 禁用
 * @prop ON - 启用
 */
export enum COUPON_STATUS {
  OFF = 'off',
  ON = 'on',
}

/**
 * @prop CUT - 减
 * @prop PERCENTAGE - 折
 */
export enum COUPON_TYPE {
  CUT = 'cut',
  PERCENTAGE = 'percentage',
}

/**
 * @prop ORDER - 订单
 * @prop PRODUCT - 商品
 */
export enum COUPON_TARGET {
  ORDER = 'order',
  PRODUCT = 'product',
}

/**
 * @prop PENDING - 等待审核
 * @prop APPROVED - 正常
 * @prop REJECTED - 违规评论
 */
export enum COMMENTS_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * @prop WAIT_PAY - 等待支付
 * @prop WAIT_HANDLE - 等待处理
 * @prop HANDLING - 处理中
 * @prop FINISHED - 完成
 * @prop CANCEL - 取消
 */
export enum ORDER_STATUS {
  WAIT_PAY = 'wait_pay',
  WAIT_HANDLE = 'wait_handle',
  HANDLING = 'handling',
  FINISHED = 'finished',
  CANCEL = 'cancel',
}

/**
 * @prop IN_SHOP - 店内使用
 * @prop USER_SELF - 用户自取
 */
export enum ORDER_TYPE {
  IN_SHOP = 'in_shop',
  USER_SELF = 'user_self',
}

/**
 * @prop DEAFULT - 默认支付方式
 */
export enum PAY_TYPE {
  DEAFULT = 'default',
}

/**
 * @prop PRODUCT - 产品
 * @prop SETS - 套装
 */
export enum OrderDetailType {
  PRODUCT = 'product',
  SETS = 'sets',
}
