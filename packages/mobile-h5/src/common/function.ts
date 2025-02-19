import type { Sets } from '@/api/modules/sets';
import { COUPON_TYPE } from './constant';
import type { Product } from '@/api/modules/product';
import { useAuthStore } from '@/stores/auth';
import { showConfirmDialog } from 'vant';

/** 计算优惠价格 */
export function calculateDiscountPrice(originalPrice: number, type: COUPON_TYPE, amount: number) {
  if (type === COUPON_TYPE.CUT) {
    return originalPrice - amount;
  } else if (type === COUPON_TYPE.PERCENTAGE) {
    return originalPrice * amount;
  } else {
    return originalPrice;
  }
}

/** 计算产品价格 */
export function calculateProductPrice(product: Product.Product, chooseOptionId: number) {
  const option = product.options.find((option) => option.id === chooseOptionId);
  if (!option) {
    throw new Error(`数据异常，请刷新页面后重试！`);
  }
  return {
    price: option.price,
    originalPrice: option.originalPrice,
  };
}

/** 计算套餐价格 */
export function calculateSetsPrice(sets: Sets.Sets, chooseOptionIds: number[]) {
  const options = sets.products.map((product, index) => {
    const option = product.options.find((option) => option.id === chooseOptionIds[index]);
    if (!option) {
      throw new Error(`数据异常，请刷新页面后重试！`);
    }
    return option;
  });
  const originalPrice = options.reduce((prev, cur) => prev + cur.originalPrice, 0);
  let price = options.reduce((prev, cur) => prev + cur.price, 0);
  price = calculateDiscountPrice(price, sets.type, sets.amount);
  return {
    price,
    originalPrice,
  };
}

/** 检查登录状态 */
export function checkLoginStatus() {
  const authStore = useAuthStore();
  return new Promise<void>((resolve, reject) => {
    if (authStore.hasLogin) {
      resolve();
    } else {
      showConfirmDialog({
        message: '需要登录才能访问！',
        confirmButtonText: '去登录',
      })
        .then(() => {
          reject(true);
        })
        .catch(() => {
          reject(false);
        });
    }
  });
}
