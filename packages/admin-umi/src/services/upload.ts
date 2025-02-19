import { AjaxResult } from '@/requestErrorConfig';
import { request } from '@umijs/max';

type UploadResult = {
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
};

/** 上传文件 */
export async function uploadFile(file: File) {
  const data = new FormData();
  data.append('file', file);
  return request<AjaxResult<UploadResult>>('/upload', {
    method: 'POST',
    data,
  });
}
