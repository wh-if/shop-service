export enum USER_ROLE {
  ADMIN, // 管理员用户
  USER, // 普通用户
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
