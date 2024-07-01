export interface IPagination {
  page?: number;
  limit?: number;
  order?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  totalPage: number;
}
