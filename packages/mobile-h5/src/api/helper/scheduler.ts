import type { AxiosResponse } from 'axios';
import { requestInstance } from '..';
import { useAuthStore } from '@/stores/auth';

export class TokenRefreshScheduler {
  /** 刷新请求是否发送 */
  static hasSend: boolean = false;

  /** 需要重发的请求 */
  static requestMap = new Map<string, (skip: boolean) => Promise<void>>();

  static subscribe(response: AxiosResponse) {
    if (!this.hasSend) {
      try {
        const authStore = useAuthStore();
        this.hasSend = true;
        authStore.updateToken().then(() => {
          this.publish();
        });
      } catch {
        this.publish(true);
      } finally {
        this.hasSend = false;
      }
    }
    return new Promise<AxiosResponse>((resolve, reject) => {
      this.requestMap.set(response.config.url!, async (skip: boolean) => {
        if (skip) {
          reject(response);
          return;
        }
        try {
          const newResponse = await requestInstance({
            ...response.config,
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
