export interface IMapper<Domain, Persistence> {
  toDomain(raw: Persistence): Domain;
  toPersistence(raw: Domain): Partial<Persistence>;
  toDomainArray(raw: Persistence[]): Domain[];
}
