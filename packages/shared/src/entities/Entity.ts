export abstract class Entity<TIdentifier extends string | number> {
  readonly id: TIdentifier;

  constructor(id: TIdentifier) {
    this.id = id;
  }
}
