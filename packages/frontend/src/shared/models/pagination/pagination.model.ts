import {
  PaginationMetaModel,
  type PaginationMetaJson,
} from "./pagination-meta.model";

export interface PaginationJson<T> {
  data: T[];
  meta: PaginationMetaJson;
}

export class Pagination<T> {
  data: T[];
  meta: PaginationMetaModel;

  constructor(data: T[], meta: PaginationMetaModel) {
    this.data = data;
    this.meta = meta;
  }

  /**
   * @param json - The raw API response containing data and meta.
   * @param ModelClass - Model class with a fromJson method for converting each item.
   */
  static fromJson<T, J>(
    json: PaginationJson<J>,
    ModelClass: { fromJson: (json: J) => T }
  ): Pagination<T> {
    const data = Array.isArray(json?.data)
      ? json.data.map((item) => ModelClass.fromJson(item))
      : [];

    const meta = PaginationMetaModel.fromJson(json?.meta);

    return new Pagination(data, meta);
  }
}
