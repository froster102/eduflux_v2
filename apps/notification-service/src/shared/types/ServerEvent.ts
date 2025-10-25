import type { ServerEvents } from '@shared/enum/ServerEvents';

export type ServerEvent<TPayload> = {
  type: ServerEvents;
  payload: TPayload;
};
