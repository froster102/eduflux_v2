export type EventMetadata = {
  id: string;
  name: string;
};

export abstract class Event<TPayload = any> {
  readonly id: string;
  readonly name: string;
  readonly timestamp: Date;
  readonly payload: TPayload;

  constructor(metadata: EventMetadata, payload: TPayload) {
    this.id = metadata.id || crypto.randomUUID().toString();
    this.name = metadata.name;
    this.timestamp = new Date();
    this.payload = payload;
  }
}

export type EventClass<T extends Event = Event> = {
  new (...args: any[]): T;
  EVENT_NAME: string;
};
