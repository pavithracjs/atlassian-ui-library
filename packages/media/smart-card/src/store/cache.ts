import { CardUpdateCallback } from '../client/types';
import { GetNowTimeFn } from './types';

type CardCacheCallback<T> = {
  fn: CardUpdateCallback<T>;
  uuid: string;
};

type CardCacheEntry<T> = {
  state: T;
  goodTill: number;
} | null;

export class CardCache<T> {
  public entry: CardCacheEntry<T> = null;
  private subscribers: CardCacheCallback<T>[] = [];

  constructor(private getNow: GetNowTimeFn) {}

  subscribe(uuid: string, fn: CardUpdateCallback<T>) {
    if (!this.subscribers.find(sub => sub.uuid === uuid)) {
      this.subscribers.push({ uuid, fn });
    }
    fn([this.entry ? this.entry.state : null, this.hasExpired()]);

    return () => {};
  }

  invalidate(): CardCache<T> {
    if (this.entry) {
      this.entry.goodTill = this.getNow() - 1;
    }
    return this;
  }

  getProp<P extends T>(propName: keyof P): P[typeof propName] | undefined {
    if (this.entry === null) {
      return;
    }
    return (this.entry.state as P)[propName];
  }

  unsubscribe(uuid: string) {
    this.subscribers = this.subscribers.filter(rec => rec.uuid !== uuid);
  }

  hasExpired(): boolean {
    if (this.entry === null) {
      return true;
    }
    return this.entry.goodTill < this.getNow();
  }

  update(state: T, lifespan: number): void {
    this.entry = {
      state,
      goodTill: this.getNow() + lifespan,
    };
    this.subscribers.forEach(rec => rec.fn([state, false]));
  }
}
