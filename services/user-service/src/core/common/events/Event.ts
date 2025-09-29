export abstract class Event {
  public readonly type: string;
  public readonly occuredAt: string;

  constructor(payload: { type: string; occuredAt: string }) {
    this.type = payload.type;
    this.occuredAt = payload.occuredAt;
  }
}
