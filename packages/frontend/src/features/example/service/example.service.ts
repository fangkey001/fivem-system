import qs from "qs";
import { BaseService } from "@/shared/services";
import {
  AxiosAdapter,
  type HttpAdapter,
  type HttpAdapterResponse,
} from "@/shared/libs";
import { Example } from "@/features/example/model";
import type { PaginationJson, Pagination } from "@/shared/models";

class ExampleService extends BaseService {
  constructor(baseEndpoint: string, httpAdapter: HttpAdapter) {
    super(baseEndpoint, httpAdapter);
  }

  public async getAll(
    params = {}
  ): Promise<HttpAdapterResponse<Pagination<Example>>> {
    const response = await this.get<PaginationJson<Example>>("", {
      params,
    });

    return this.paginated(response, Example);
  }

  public async getByCode(
    params = {}
  ): Promise<HttpAdapterResponse<Example | null>> {
    const queryParams = qs.stringify(params);
    const response = await this.get<{ data: Example }>(
      `/example?${queryParams}`
    );

    return this.item(response, Example);
  }
}

const httpAdapter: HttpAdapter = new AxiosAdapter();
export const exampleService = new ExampleService("/v1/example", httpAdapter);
