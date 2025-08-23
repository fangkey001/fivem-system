import Cookies from "js-cookie";
import { APP_CONFIG } from "@/shared/configs";
import type {
  HttpAdapterOptions,
  HttpAdapterResponse,
} from "@/shared/libs/fetcher/http-interface";
import {
  CustomApiError,
  type ApiErrorResponse,
} from "@/shared/types/custoa-api-error.type";

export class FetcherAdapter {
  private readonly baseUrl: string = APP_CONFIG.API_URL;

  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...customHeaders,
    });

    const authToken = Cookies.get("token");

    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    return headers;
  }

  private async executeRequest<T>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<HttpAdapterResponse<T>> {
    const response = await fetch(input, {
      ...init,
      headers: this.getHeaders(init?.headers),
    });

    if (!response.ok) {
      let errorData: CustomApiError | null = null;

      try {
        errorData = await response.json();
      } catch {
        throw new CustomApiError(
          `HTTP Error: ${response.status}`,
          `HTTP_ERROR_${response.status}`
        );
      }

      const apiError = errorData as ApiErrorResponse;
      if (apiError?.code && apiError?.message) {
        throw new CustomApiError(apiError.message, apiError.code, apiError);
      }
      throw new CustomApiError(
        `HTTP Error: ${response.status}`,
        `HTTP_ERROR_${response.status}`,
        errorData ?? undefined
      );
    }

    const data = await response.json();

    return {
      isOk: response.ok,
      data: response.ok ? data : null,
      error: response.ok
        ? null
        : new CustomApiError(
            `HTTP Error: ${response.status}`,
            `HTTP_ERROR_${response.status}`,
            data
          ),
    };
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  get<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const fullUrl = this.buildUrl(url, options?.params);
    const config: RequestInit = {
      method: "GET",
      headers: this.getHeaders(options?.headers),
    };

    return this.executeRequest<T>(fullUrl, config);
  }

  post<T>(
    url: string,
    body: T,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const fullUrl = this.buildUrl(url, options?.params);
    const config: RequestInit = {
      method: "POST",
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    };

    return this.executeRequest<T>(fullUrl, config);
  }

  put<T>(
    url: string,
    body: T,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const fullUrl = this.buildUrl(url, options?.params);
    const config: RequestInit = {
      method: "PUT",
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    };

    return this.executeRequest<T>(fullUrl, config);
  }

  delete<T>(
    url: string,
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    const fullUrl = this.buildUrl(url, options?.params);
    const config: RequestInit = {
      method: "DELETE",
      headers: this.getHeaders(options?.headers),
    };

    return this.executeRequest<T>(fullUrl, config);
  }
}
