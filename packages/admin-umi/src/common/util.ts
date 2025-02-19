import { cloneDeep } from 'lodash-es';

/** 将时间数据转换成可读性更高的字符串 */
export function toLocaleString(
  val: string | Date,
  type: 'toLocaleString' | 'toLocaleDateString' = 'toLocaleString',
) {
  if (typeof val === 'string') {
    return new Date(val)[type]();
  } else if (val instanceof Date) {
    return val[type]();
  }
}

/** 获取图片文件的base64数据 */
export const getBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function formatToChildren<T extends { id: number; parentId: number }>(list: T[]) {
  let resultList = cloneDeep(list) as (T & { children: T[] })[];
  resultList.forEach((i) => {
    if (i.parentId !== 0) {
      const parent = resultList.find((j) => i.parentId === j.id);
      if (!parent) {
        return;
      } else if (Array.isArray(parent.children)) {
        parent.children.push(i);
      } else {
        parent.children = [i];
      }
    }
  });
  resultList = resultList.filter((i) => i.parentId === 0);
  return resultList;
}
