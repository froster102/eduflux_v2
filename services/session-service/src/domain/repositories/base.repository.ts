export interface IBaseRepository<TDomain> {
  save(entity: TDomain): Promise<TDomain>;
  saveMany(entities: TDomain[]): Promise<TDomain[]>;
  update(id: string, data: Partial<TDomain>): Promise<TDomain | null>;
  updateMany(updates: { id: string; data: Partial<TDomain> }[]): Promise<void>;
  findById(id: string): Promise<TDomain | null>;
  findByIds(ids: string[]): Promise<TDomain[]>;
  deleteById(id: string): Promise<boolean>;
}
