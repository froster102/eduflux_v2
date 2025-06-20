export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
  searchFields?: string[];
  filters?: {
    [key: string]: string | number | boolean | string[] | number[];
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
