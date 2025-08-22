import type { IUseCase } from './use-case.interface';
import type {
  SessionQueryParameters,
  SessionQueryResults,
} from '@/domain/repositories/session.repository';

export interface GetSessionsInput {
  exectorId: string;
  queryParmeters?: SessionQueryParameters;
}

export interface IGetSessionsUseCase
  extends IUseCase<GetSessionsInput, SessionQueryResults> {}
