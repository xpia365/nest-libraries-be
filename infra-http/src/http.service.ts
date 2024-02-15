import { Inject, Injectable } from '@nestjs/common';
import Axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { AXIOS_INSTANCE_TOKEN } from './http.const';

@Injectable()
export class HttpClientService {
  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN)
    protected readonly instance: AxiosInstance = Axios,
  ) {}

  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.makePromise<T>(this.instance.request, config);
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.makePromise<T>(this.instance.get, url, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.makePromise<T>(this.instance.delete, url, config);
  }

  head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.makePromise<T>(this.instance.head, url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.makePromise<T>(this.instance.post, url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.makePromise<T>(this.instance.put, url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.makePromise<T>(this.instance.patch, url, data, config);
  }

  get axiosRef(): AxiosInstance {
    return this.instance;
  }

  protected makePromise<T>(
    axios: (...args: any[]) => AxiosPromise<T>,
    ...args: any[]
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = { ...(args[args.length - 1] || {}) };

    let cancelSource: CancelTokenSource;
    if (!config.cancelToken) {
      cancelSource = Axios.CancelToken.source();
      config.cancelToken = cancelSource.token;
    }

    return axios(...args)
      .then((res) => {
        if (config.responseType === 'stream') {
          return res; // Return the response directly for streams
        }

        return res;
      })
      .finally(() => {
        if (config.responseType !== 'stream' && cancelSource) {
          cancelSource.cancel();
        }
      });
  }
}
