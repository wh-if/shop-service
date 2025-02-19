/* eslint-disable */

/** 校验手机号码 */
export function validateChinesePhone(phone: string) {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

/** 对象比较 */
export function deepCompare(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepCompare(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
