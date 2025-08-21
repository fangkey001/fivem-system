export interface PaginationMetaJson {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export class PaginationMetaModel {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;

  constructor(meta: PaginationMetaModel) {
    this.total = meta.total;
    this.perPage = meta.perPage;
    this.currentPage = meta.currentPage;
    this.lastPage = meta.lastPage;
  }

  static fromJson(json: PaginationMetaJson): PaginationMetaModel {
    return new PaginationMetaModel({
      total: json.total,
      perPage: json.per_page,
      currentPage: json.current_page,
      lastPage: json.last_page,
    });
  }
}
