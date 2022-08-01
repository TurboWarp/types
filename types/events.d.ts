// Type definitions for the Node.js events module
// Project: https://nodejs.org/api/events.html

type EventEmitterArgs<Events, K extends keyof Events> = Events[K] extends Array<unknown> ? Events[K] : unknown[];
type EventEmitterCallback<Events, K extends keyof Events> = (...args: Events[K] extends Array<unknown> ? Events[K] : unknown[]) => void

declare class EventEmitter<Events> {
  on<K extends keyof Events>(event: K, callback: EventEmitterCallback<Events, K>): void;
  once<K extends keyof Events>(event: K, callback: EventEmitterCallback<Events, K>): void;
  off<K extends keyof Events>(event: K, callback: EventEmitterCallback<Events, K>): void;
  removeListener<K extends keyof Events>(event: K, callback: EventEmitterCallback<Events, K>): void;
  listeners<K extends keyof Events>(event: K): EventEmitterCallback<Events, K>[];
  emit<K extends keyof Events>(event: K, ...args: EventEmitterArgs<Events, K>): void;
}
