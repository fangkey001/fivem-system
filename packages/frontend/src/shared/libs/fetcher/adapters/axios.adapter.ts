import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "js-cookie";
import { APP_CONFIG } from "@/app/configs";
import {
  CustomApiError,
  type ApiErrorResponse,
} from "@/shared/types/custoa-api-error.type";
import type {
  HttpAdapterOptions,
  HttpAdapterResponse,
} from "@/shared/libs/fetcher/http-interface";

const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      if (errorData?.code && errorData?.message) {
        return Promise.reject(
          new CustomApiError(errorData.message, errorData.code, errorData)
        );
      }
      return Promise.reject(
        new CustomApiError(
          `HTTP Error: ${error.response.status}`,
          `HTTP_ERROR_${error.response.status}`,
          error.response.data as object
        )
      );
    }
    if (error.request) {
      return Promise.reject(
        new CustomApiError(
          "No response from server. Check network connection.",
          "NETWORK_ERROR"
        )
      );
    }
    return Promise.reject(
      new CustomApiError(
        `Request setup failed: ${error.message}`,
        "REQUEST_SETUP_ERROR"
      )
    );
  }
);

export class AxiosAdapter {
  private readonly client: AxiosInstance = apiClient;

  private async execute<T>(
    request: () => Promise<AxiosResponse>
  ): Promise<HttpAdapterResponse<T>> {
    try {
      const response = await request();
      return {
        isOk: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      return {
        isOk: false,
        data: null,
        error: error as CustomApiError,
      };
    }
  }

  private headersConfig<T>(
    options?: HttpAdapterOptions<T>
  ): AxiosRequestConfig["headers"] {
    return options?.headers &&
      !(Array.isArray(options.headers) || options.headers instanceof Headers)
      ? options.headers
      : undefined;
  }

  get<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const config: AxiosRequestConfig = {
      params: options?.params,
      headers: this.headersConfig(options),
    };
    return this.execute(() => this.client.get<T>(url, config));
  }

  post<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const config: AxiosRequestConfig = {
      params: options?.params,
      headers: this.headersConfig(options),
    };
    return this.execute(() => this.client.post<T>(url, options?.data, config));
  }

  put<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const config: AxiosRequestConfig = {
      params: options?.params,
      headers: this.headersConfig(options),
    };
    return this.execute(() => this.client.put<T>(url, options?.data, config));
  }

  delete<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const config: AxiosRequestConfig = {
      params: options?.params,
      headers: this.headersConfig(options),
    };
    return this.execute(() => this.client.delete<T>(url, config));
  }
}
