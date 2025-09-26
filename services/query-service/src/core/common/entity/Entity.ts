import { EntityIdEmptyException } from "@core/common/exception/EntityIdEmptyException";

export abstract class Entity<TIdentifier extends string | number> {
  protected readonly id?: TIdentifier;

  constructor(id: TIdentifier) {
    this.id = id;
  }

  public getId(): TIdentifier {
    if (typeof this.id === "undefined") {
      throw new EntityIdEmptyException(this.constructor.name);
    }
    return this.id;
  }
}
