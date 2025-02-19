import axios, { type AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import { PLATFORM_TYPE, type AjaxResult } from './helper/types';
import { useAuthStore } from '@/stores/auth';
import { TokenRefreshScheduler } from './helper/scheduler';
import { showConfirmDialog, showFailToast } from 'vant';
import router from '@/router';

const config: AxiosRequestConfig = {
  baseURL: '/api',
  timeout: 30000,
  /** 处理url中传递对象或数组 */
  paramsSerializer: (params) => stringify(params, { arrayFormat: 'brackets' }),
};

const requestInstance = axios.create(config);

// 添加请求拦截器
requestInstance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const authStore = useAuthStore();
    const token =
      config.url === '/auth/token' ? authStore.state?.refresh_token : authStore.state?.access_token;

    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }

    // 当前平台信息
    config.headers.platform = PLATFORM_TYPE.MOBILE_H5;
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
requestInstance.interceptors.response.use(
  async function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    let res = response;

    // access_token过期，刷新token
    if ((res.data as unknown as AjaxResult).code === 2) {
      res = await TokenRefreshScheduler.subscribe(res);
    }

    // 拦截响应数据，进行个性化处理
    const { code, message: msg } = res.data as unknown as AjaxResult;

    if (code === 1) {
      showFailToast(msg || '请求失败！');
      return Promise.reject(res);
    }

    return res;
  },
  function (error) {
    if (error.response.status === 401) {
      showConfirmDialog({
        message: '登录已过期，请重新登录！',
        confirmButtonText: '去登录',
      })
        .then(() => {
          router.push('/login');
        })
        .catch(() => {});
    } else {
      showFailToast('内部错误，查看控制台！');
    }

    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      console.log(error.request);
    } else {
      // 发送请求时出了点问题
      console.log('Error', error.message);
    }
    console.log(error.config);
    return Promise.reject(error);
  },
);

const request = async <T>(config: AxiosRequestConfig) => {
  return new Promise<AjaxResult<T>>(async (resolve) => {
    const { data } = await requestInstance<AjaxResult<T>>(config);
    resolve(data);
  });
};

export { request, requestInstance };
