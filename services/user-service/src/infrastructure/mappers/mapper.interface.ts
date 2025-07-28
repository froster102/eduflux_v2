export interface IMapper<Domain, Persistence> {
  toDomain(raw: Persistence): Domain;
  toPersistance(raw: Domain): Partial<Persistence>;
  toDomainArray(raw: Persistence[]): Domain[];
}
