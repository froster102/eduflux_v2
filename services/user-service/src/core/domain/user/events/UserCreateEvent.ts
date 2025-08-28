export class UserCreateEvent {
  public readonly type: string;
  public readonly id: string;
  public readonly image: string;
  public readonly userName: string;
  public readonly occuredAt: string;

  private constructor(
    type: string,
    id: string,
    image: string,
    userName: string,
    occuredAt: string,
  ) {
    this.type = type;
    this.id = id;
    this.image = image;
    this.userName = userName;
    this.occuredAt = occuredAt;
  }

  public static new(
    type: string,
    id: string,
    image: string,
    userName: string,
    occuredAt: string,
  ): UserCreateEvent {
    return new UserCreateEvent(type, id, image, userName, occuredAt);
  }
}
