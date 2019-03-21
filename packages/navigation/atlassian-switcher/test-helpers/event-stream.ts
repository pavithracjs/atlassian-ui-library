import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

interface NextOp {
  type: 'next';
  target: number;
}

interface SkipOp {
  type: 'skip';
  target: number;
  skipped: number;
}

type OpDefinition = NextOp | SkipOp;

export interface EventStream {
  (event: UIAnalyticsEvent): void;
  next: () => Promise<UIAnalyticsEvent>;
  skip: (skippedCalls: number) => Promise<UIAnalyticsEvent[]>;
}

const createEventStream: () => EventStream = () => {
  const operationQueue: OpDefinition[] = [];
  let currentAccept: Function;
  const allEvents: UIAnalyticsEvent[] = [];

  const callback = (event: UIAnalyticsEvent) => {
    allEvents.push(event);
    evaluateQueueOnCallback();
  };

  const getNewTarget = (positions: number = 1) =>
    operationQueue.length
      ? operationQueue[0].target + positions
      : positions - 1;

  const evaluateQueueOnCallback = () => {
    const element = evaluateQueue();
    if (element && currentAccept) {
      currentAccept(element);
    }
  };

  function evaluateQueueOnMethod() {
    const element = evaluateQueue();
    if (element) {
      return Promise.resolve(element);
    }
    return new Promise(accept => {
      currentAccept = accept;
    });
  }

  const evaluateQueue = () => {
    if (!operationQueue.length) {
      return;
    }
    const nextOp = operationQueue[0];
    if (nextOp.type === 'next' && nextOp.target < allEvents.length) {
      return allEvents[nextOp.target];
    } else if (nextOp.type === 'skip' && nextOp.target < allEvents.length) {
      return allEvents.slice(
        nextOp.target - nextOp.skipped + 1,
        nextOp.target + 1,
      );
    }
  };

  callback.next = () => {
    operationQueue.unshift({
      type: 'next',
      target: getNewTarget(),
    });

    return evaluateQueueOnMethod() as Promise<UIAnalyticsEvent>;
  };

  callback.skip = (calls: number) => {
    operationQueue.unshift({
      type: 'skip',
      skipped: calls,
      target: getNewTarget(calls),
    });

    return evaluateQueueOnMethod() as Promise<UIAnalyticsEvent[]>;
  };
  return callback;
};

export default createEventStream;
