export interface UseCase<TInputPort, TUseCaseOutput> {
  execute(input: TInputPort): Promise<TUseCaseOutput>;
}
