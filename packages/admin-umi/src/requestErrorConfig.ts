import type { AxiosResponse, RequestOptions } from '@@/plugin-request/request';
import { history, request, type RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { refreshToken } from './services/auth';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * 0 成功
 * 1 一般失败
 * 2 token过期刷新
 *  */
type CodeType = 0 | 1 | 2;

export interface AjaxResult<T = object> {
  code: CodeType;
  message: string;
  data: T;
}

class TokenRefreshScheduler {
  /** 刷新请求是否发送 */
  static hasSend: boolean = false;

  /** 需要重发的请求 */
  static requestMap = new Map<string, (skip: boolean) => Promise<void>>();

  static async subscribe(response: AxiosResponse) {
    if (!this.hasSend) {
      this.hasSend = true;
      refreshToken()
        .then(({ data }) => {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          this.publish();
        })
        .catch(() => {
          this.publish(true);
        })
        .finally(() => {
          this.hasSend = false;
        });
    }
    return new Promise<AxiosResponse>((resolve, reject) => {
      this.requestMap.set(response.config.url!, async (skip: boolean) => {
        if (skip) {
          resolve(response);
          return;
        }
        try {
          const newResponse = await request(response.config.url!, {
            ...response.config,
            getResponse: true,
          });
          resolve(newResponse);
        } catch {
          reject();
        }
      });
    });
  }

  static publish(skip: boolean = false) {
    this.requestMap.forEach((fn, key) => {
      if (fn) {
        fn(skip);
        this.requestMap.delete(key);
      }
    });
  }
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  baseURL: '/api',
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        if (error.response.status === 401) {
          message.warning('请重新登录后再操作！');
          history.push('/login');
        } else {
          message.error(`Response status:${error.response.status}\n${error.response.data.message}`);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const token = localStorage.getItem(
        config.url === '/auth/token' ? 'refresh_token' : 'access_token',
      );
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`;
      }

      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    async (res) => {
      let response = res;

      // access_token过期，刷新token
      if ((response.data as unknown as AjaxResult).code === 2) {
        response = await TokenRefreshScheduler.subscribe(response);
      }

      // 拦截响应数据，进行个性化处理
      const { code, message: msg } = response.data as unknown as AjaxResult;

      if (code === 1) {
        message.warning(msg || '请求失败！');
      }

      return response;
    },
  ],
};
