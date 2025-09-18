import { EntityIdEmptyException } from "@core/common/exception/EntityIdEmptyException";

export abstract class Entity<TIdentifier extends string | number> {
  protected readonly _id?: TIdentifier;

  constructor(id: TIdentifier) {
    this._id = id;
  }

  get id(): TIdentifier {
    if (typeof this._id === "undefined") {
      throw new EntityIdEmptyException(this.constructor.name);
    }
    return this._id;
  }
}
