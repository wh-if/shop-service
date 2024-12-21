export enum USER_ROLE {
  ADMIN = 'admin', // 管理员用户
  USER = 'user', // 普通用户
}

export enum USER_STATUS {
  ON, // 正常
  OFF, // 禁用
  REMOVED, // 注销
}

export enum PRODUCT_STATUS {
  ON, // 上架
  OFF, // 下架
}

export enum COUPON_STATUS {
  OFF, // 禁用
  ON, // 启用
}

export enum COUPON_TYPE {
  CUT, // 减
  PERCENTAGE, // 折
}

export enum COUPON_TARGET {
  ORDER, // 作用于整个订单
  PRODUCT, // 作用于单个商品
}

export enum COMMENTS_STATUS {
  PENDING, // 等待审核
  APPROVED, // 正常
  REJECTED, // 违规评论
}

export enum ORDER_STATUS {
  WAIT_PAY, // 等待支付
  WAIT_HANDLE, // 等待处理
  HANDLING, // 处理中
  FINISHED, // 完成
  CANCEL, // 取消
}

export enum ORDER_TYPE {
  IN_SHOP, // 店内使用
  USER_SELF, // 用户自取
}

export enum PAY_TYPE {
  DEAFULT, // 默认支付方式
}

export enum OrderDetailType {
  Product,
  Sets,
}
