export class Entity<TIdentifier extends string | number> {
  protected id?: TIdentifier;

  getId(): TIdentifier {
    if (!this.id) {
      throw new Error(`${this.constructor.name} ID is empty.`);
    }
    return this.id;
  }
}
