declare class EventEmitter<Events> {
  on<K extends keyof Events>(eventName: K, callback: (...args: Events[K] extends Array<unknown> ? Events[K] : unknown[]) => void): void;
  emit<K extends keyof Events>(eventName: K, ...args: Events[K] extends Array<unknown> ? Events[K] : unknown[]): void;
}
