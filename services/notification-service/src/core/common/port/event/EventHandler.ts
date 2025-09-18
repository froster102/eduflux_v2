export interface EventHandler<TEvent, TResult> {
  handle(event: TEvent): Promise<TResult>;
}
