export interface UseCase<TInputPort, TUseCaseOutput> {
  execute(payload: TInputPort): Promise<TUseCaseOutput>;
}
