declare module "axios" {
  export interface AxiosRequestConfig {
    baseURL?: string;
    withCredentials?: boolean;
    headers?: Record<string, string>;
  }

  export interface AxiosResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
  }

  export interface AxiosInstance {
    get<T = unknown>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>>;
    post<T = unknown>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>>;
    patch<T = unknown>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>>;
    interceptors: {
      request: {
        use(
          onFulfilled: (
            config: AxiosRequestConfig,
          ) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
          onRejected?: (error: unknown) => unknown,
        ): number;
      };
    };
  }

  export function create(config?: AxiosRequestConfig): AxiosInstance;

  const axios: {
    create: typeof create;
  };

  export default axios;
}
