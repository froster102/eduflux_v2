export interface UseCase<TUseCaseInput, TUseCaseResult> {
  execute(payload: TUseCaseInput): Promise<TUseCaseResult>;
}
