export interface IMapper<Domain, Persistance> {
  toDomain(raw: Persistance): Domain;
  toPersistance(raw: Domain): Partial<Persistance>;
}
