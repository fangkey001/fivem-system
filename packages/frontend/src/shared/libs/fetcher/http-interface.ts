import type { CustomApiError } from "@/shared/types/custoa-api-error.type";

export interface HttpAdapterOptions<T> {
  headers?: HeadersInit;
  params?: Record<string, string>;
  data?: T;
}

export interface HttpAdapterResponse<T> {
  isOk: boolean;
  error?: CustomApiError | null;
  data?: T | null;
}

export interface HttpAdapter {
  get<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>>;
  post<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>>;
  put<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>>;
  delete<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>>;
}
