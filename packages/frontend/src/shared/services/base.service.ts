import type {
  HttpAdapter,
  HttpAdapterOptions,
  HttpAdapterResponse,
} from "@/shared/libs/fetcher";
import { Pagination, type PaginationJson } from "@/shared/models/pagination";

interface ModelStatic<TModel, TJson> {
  fromJson(json: TJson): TModel;
}

export class BaseService {
  protected baseEndpoint: string;
  protected http: HttpAdapter;

  /**
   * @param baseEndpoint - Base path for the resource (e.g., '/users')
   * @param httpAdapter - An instance of a class that implements IHttpAdapter (e.g., AxiosAdapter, FetchAdapter)
   */
  constructor(baseEndpoint: string, httpAdapter: HttpAdapter) {
    this.baseEndpoint = baseEndpoint;
    this.http = httpAdapter;
  }

  /**
   * Processes a result for a single item, converting JSON to a Model instance.
   * @param result - The raw API response containing a single data object.
   * @param ModelClass - The model class to use for conversion.
   * @returns An IFetchResult containing the instantiated model.
   */
  protected item<TModel, TJson>(
    result: HttpAdapterResponse<{ data: TJson }>,
    ModelClass: ModelStatic<TModel, TJson>
  ): HttpAdapterResponse<TModel> {
    if (!result.isOk || !result.data) {
      return { isOk: result.isOk, error: result.error, data: null };
    }

    return {
      isOk: true,
      error: null,
      data: ModelClass.fromJson(result.data.data),
    };
  }

  /**
   * Processes a result for a collection of items, converting a JSON array to an array of Model instances.
   * @param result - The raw API response containing an array of data objects.
   * @param ModelClass - The model class to use for conversion.
   * @returns An IFetchResult containing an array of instantiated models.
   */
  protected collection<TModel, TJson>(
    result: HttpAdapterResponse<{ data: TJson[] }>,
    ModelClass: ModelStatic<TModel, TJson>
  ): HttpAdapterResponse<TModel[]> {
    if (!result.isOk || !result.data) {
      return { ...result, data: [] };
    }
    const modelArray = result.data.data.map((item) =>
      ModelClass.fromJson(item)
    );
    return {
      ...result,
      data: modelArray,
    };
  }

  /**
   * Processes a paginated result, converting it into a PaginationModel.
   * @param result - The raw API response containing paginated data.
   * @param ModelClass - The model class to use for converting the items within the pagination data.
   * @returns An IFetchResult containing an instantiated PaginationModel.
   */
  protected paginated<TModel, TJson>(
    result: HttpAdapterResponse<PaginationJson<TJson>>,
    ModelClass: ModelStatic<TModel, TJson>
  ): HttpAdapterResponse<Pagination<TModel>> {
    if (!result.isOk || !result.data) {
      return { isOk: result.isOk, error: result.error, data: null };
    }

    return {
      isOk: true,
      error: null,
      data: Pagination.fromJson(result.data, ModelClass),
    };
  }

  // The core HTTP methods now delegate to the injected adapter.
  protected get<T>(
    path: string = "",
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    return this.http.get<T>(`${this.baseEndpoint}${path}`, options);
  }

  protected post<T>(
    path: string = "",
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    return this.http.post<T>(`${this.baseEndpoint}${path}`, options);
  }

  protected put<T>(
    path: string = "",
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    return this.http.put<T>(`${this.baseEndpoint}${path}`, options);
  }

  protected delete<T>(
    path: string = "",
    options?: HttpAdapterOptions<T>
  ): Promise<HttpAdapterResponse<T>> {
    return this.http.delete<T>(`${this.baseEndpoint}${path}`, options);
  }
}
