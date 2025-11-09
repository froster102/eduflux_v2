export interface IMapper<Domain, Persistence> {
  toDomain(raw: Persistence): Domain;
  toPersistence(raw: Domain): Partial<Persistence>;
  toDomainEntities(raw: Persistence[]): Domain[];
}
