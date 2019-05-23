import {
  MentionNameClient,
  MentionNameDetails,
  MentionNameResult,
} from './MentionNameClient';

interface Callback {
  (value?: string): void;
}

export class MentionNameResolver {
  private static waitForBatch = 100; // ms
  private client: MentionNameClient;
  private nameCache: Map<string, MentionNameDetails> = new Map();
  private nameQueue: Map<string, Callback[]> = new Map();
  private processingQueue: Map<string, Callback[]> = new Map();
  private debounce: number = 0;

  constructor(client: MentionNameClient) {
    this.client = client;
  }

  lookupName(id: string): Promise<string> | string {
    const name = this.nameCache.get(id);
    if (name) {
      return this.processName(name);
    }

    return new Promise(resolve => {
      const processingItems = this.processingQueue.get(id);
      if (processingItems) {
        this.processingQueue.set(id, [...processingItems, resolve]);
      }

      const queuedItems = this.nameQueue.get(id) || [];
      this.nameQueue.set(id, [...queuedItems, resolve]);

      if (!this.debounce) {
        this.debounce = window.setTimeout(
          this.processQueue,
          MentionNameResolver.waitForBatch,
        );
      }

      if (this.isQueueAtLimit()) {
        this.processQueue();
      }
    });
  }

  cacheName(id: string, name: string) {
    this.nameCache.set(id, {
      id,
      name,
      result: MentionNameResult.OK,
    });
  }

  private processName(name: MentionNameDetails): string {
    switch (name.result) {
      case MentionNameResult.OK:
        return name.name || '';
      case MentionNameResult.SERVICE_ERROR:
        // TODO i18n
        return 'Unable to load';
      case MentionNameResult.UNKNOWN:
      default:
        // TODO i18n
        return 'Unknown';
    }
  }

  private isQueueAtLimit() {
    return this.client.getLookupLimit() >= this.nameCache.size;
  }

  private splitQueueAtLimit() {
    const values = Array.from(this.nameQueue.entries());
    const splitPoint = this.client.getLookupLimit();

    return {
      queue: new Map(values.slice(0, splitPoint)),
      extraQueue: new Map(values.slice(splitPoint)),
    };
  }

  private processQueue = () => {
    clearTimeout(this.debounce);
    this.debounce = 0;

    const { queue, extraQueue } = this.splitQueueAtLimit();
    this.nameQueue = extraQueue;
    this.processingQueue = new Map([...this.processingQueue, ...queue]);
    this.client.lookupMentionNames(Array.from(queue.keys())).then(response => {
      response.forEach(mentionDetail => {
        const { id } = mentionDetail;
        const resolvers = this.processingQueue.get(id);
        if (resolvers) {
          this.processingQueue.delete(id);
          // TODO error handling
          this.nameCache.set(id, mentionDetail);
          resolvers.forEach(resolve => {
            try {
              // TODO process
              resolve(this.processName(mentionDetail));
            } catch {
              // ignore - exception in consumer
            }
          });
        }
      });
    });

    // Make sure anything left in the queue gets processed.
    if (this.nameQueue.size > 0) {
      this.debounce = window.setTimeout(
        this.processQueue,
        MentionNameResolver.waitForBatch,
      );
    }
  };
}
