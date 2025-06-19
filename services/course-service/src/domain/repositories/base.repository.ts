export interface IBaseRepository<TDomain> {
  save(entity: TDomain): Promise<TDomain>;
  update(id: string, data: Partial<TDomain>): Promise<TDomain | null>;
  findById(id: string): Promise<TDomain | null>;
  deleteById(id: string): Promise<boolean>;
  find(query?: {
    filter?: { [P in keyof TDomain]?: TDomain[P] };
    projection?: { [P in keyof TDomain]?: boolean | number };
    sort?: { [P in keyof TDomain]?: 'asc' | 'desc' | 1 | -1 };
    skip?: number;
    limit?: number;
    populate?:
      | string[]
      | {
          path: string;
          select?: string;
        }[];
    include?: Array<any>;
  }): Promise<TDomain[]>;
  getTotalItems(): Promise<number>;
}
