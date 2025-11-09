import type {
  BookSessionRequest,
  Session,
} from '@shared/adapters/grpc/generated/session';

export interface SessionServicePort {
  getSession(sessionId: string): Promise<Session>;
  bookSession(request: BookSessionRequest): Promise<Session>;
}
