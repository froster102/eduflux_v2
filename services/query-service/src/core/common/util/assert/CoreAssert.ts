import type { Nullable, Optional } from "@core/common/types/CommonTypes";

export class CoreAssert {
  public static isTrue(expression: boolean, exeception: Error) {
    if (!expression) {
      throw exeception;
    }
  }

  public static isFalse(expression: boolean, exeception: Error) {
    if (expression) {
      throw exeception;
    }
  }

  public static notEmpty<T>(
    value: Optional<Nullable<T>>,
    exeception: Error,
  ): T {
    if (value === null || value === undefined) {
      throw exeception;
    }
    return value;
  }
}
