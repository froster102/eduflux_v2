import type { Session } from '@shared/types/Session';

export interface ISessionService {
  getSession(sessionId: string): Promise<Session>;
}
