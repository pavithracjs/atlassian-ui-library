import {
  DefaultMentionNameResolver,
  MentionNameResolver,
} from '../../../api/MentionNameResolver';
import { MentionNameClient } from '../../../api/MentionNameClient';
import {
  isPromise,
  MentionNameDetails,
  MentionNameStatus,
} from '../../../types';

describe('MentionNameResolver', () => {
  let mentionNameResolver: MentionNameResolver;
  let mentionNameClientMock: MentionNameClient;
  let lookupMentionNames: jest.Mock<
    (ids: string[]) => Promise<MentionNameDetails[]>
  >;

  beforeEach(() => {
    lookupMentionNames = jest.fn();
    mentionNameClientMock = {
      getLookupLimit: () => 2,
      lookupMentionNames,
    };

    mentionNameResolver = new DefaultMentionNameResolver(mentionNameClientMock);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('lookup when cached does not call client', () => {
    mentionNameResolver.cacheName('cheese', 'bacon');
    expect(mentionNameResolver.lookupName('cheese')).toEqual({
      id: 'cheese',
      name: 'bacon',
      status: MentionNameStatus.OK,
    });
    expect(lookupMentionNames).toHaveBeenCalledTimes(0);
  });

  it('lookup when not cached, and found in client', done => {
    lookupMentionNames.mockReturnValue(
      Promise.resolve([
        {
          id: 'cheese',
          name: 'bacon',
          status: MentionNameStatus.OK,
        },
      ]),
    );
    const namePromise = mentionNameResolver.lookupName('cheese');
    jest.runAllTimers();
    if (isPromise(namePromise)) {
      namePromise
        .then(name => {
          expect(name).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          // Ensure cached
          const name2 = mentionNameResolver.lookupName('cheese');
          expect(name2).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(err => fail(`Promise was rejected ${err}`));
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${typeof namePromise}`,
      );
    }
  });

  it('lookup when not cached, and not found in client', done => {
    lookupMentionNames.mockReturnValue(
      Promise.resolve([
        {
          id: 'cheese',
          status: MentionNameStatus.UNKNOWN,
        },
      ]),
    );
    const namePromise = mentionNameResolver.lookupName('cheese');
    jest.runAllTimers();
    if (isPromise(namePromise)) {
      namePromise
        .then(name => {
          expect(name).toEqual({
            id: 'cheese',
            status: MentionNameStatus.UNKNOWN,
          });
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(err => fail(`Promise was rejected ${err}`));
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${typeof namePromise}`,
      );
    }
  });

  it('lookup when not cached, and error for id in client', done => {
    lookupMentionNames.mockReturnValue(
      Promise.resolve([
        {
          id: 'cheese',
          status: MentionNameStatus.SERVICE_ERROR,
        },
      ]),
    );
    const namePromise = mentionNameResolver.lookupName('cheese');
    jest.runAllTimers();
    if (isPromise(namePromise)) {
      namePromise
        .then(name => {
          expect(name).toEqual({
            id: 'cheese',
            status: MentionNameStatus.SERVICE_ERROR,
          });
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(err => fail(`Promise was rejected ${err}`));
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${typeof namePromise}`,
      );
    }
  });

  it('lookup when not cached, and error in client', done => {
    lookupMentionNames.mockReturnValue(Promise.reject('bad times'));
    const namePromise = mentionNameResolver.lookupName('cheese');
    jest.runAllTimers();
    if (isPromise(namePromise)) {
      namePromise
        .then(name => {
          expect(name).toEqual({
            id: 'cheese',
            status: MentionNameStatus.SERVICE_ERROR,
          });
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(err => fail(`Promise was rejected ${err}`));
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${typeof namePromise}`,
      );
    }
  });

  it('lookup when not cached, exceed batch size', done => {
    lookupMentionNames.mockReturnValueOnce(
      Promise.resolve([
        {
          id: 'cheese',
          name: 'bacon',
          status: MentionNameStatus.OK,
        },
        {
          id: 'ham',
          name: 'mustard',
          status: MentionNameStatus.OK,
        },
      ]),
    );
    lookupMentionNames.mockReturnValueOnce(
      Promise.resolve([
        {
          id: 'mighty',
          name: 'mouse',
          status: MentionNameStatus.OK,
        },
      ]),
    );
    lookupMentionNames.mockRejectedValue('unexpected call');
    const promises = [
      mentionNameResolver.lookupName('cheese'),
      mentionNameResolver.lookupName('ham'),
      mentionNameResolver.lookupName('mighty'),
    ];

    jest.runAllTimers();

    if (promises.every(p => isPromise(p))) {
      Promise.all(promises)
        .then(names => {
          expect(lookupMentionNames).toHaveBeenCalledTimes(2);
          expect(lookupMentionNames).toHaveBeenNthCalledWith(1, [
            'cheese',
            'ham',
          ]);
          expect(lookupMentionNames).toHaveBeenNthCalledWith(2, ['mighty']);
          expect(names[0]).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          expect(names[1]).toEqual({
            id: 'ham',
            name: 'mustard',
            status: MentionNameStatus.OK,
          });
          expect(names[2]).toEqual({
            id: 'mighty',
            name: 'mouse',
            status: MentionNameStatus.OK,
          });
          // Ensure all cached (return value not promise)
          let cachedName = mentionNameResolver.lookupName('cheese');
          expect(cachedName).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          cachedName = mentionNameResolver.lookupName('ham');
          expect(cachedName).toEqual({
            id: 'ham',
            name: 'mustard',
            status: MentionNameStatus.OK,
          });
          cachedName = mentionNameResolver.lookupName('mighty');
          expect(cachedName).toEqual({
            id: 'mighty',
            name: 'mouse',
            status: MentionNameStatus.OK,
          });
          done();
        })
        .catch(err => {
          fail(`Promises were rejected ${err}`);
        });
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${promises.map(
          p => typeof p,
        )}`,
      );
    }
    done();
  });

  it('lookup twice when not cached, only one call to client, but both callbacks', done => {
    lookupMentionNames.mockReturnValue(
      Promise.resolve([
        {
          id: 'cheese',
          name: 'bacon',
          status: MentionNameStatus.OK,
        },
      ]),
    );
    const promises = [
      mentionNameResolver.lookupName('cheese'),
      mentionNameResolver.lookupName('cheese'),
    ];

    jest.runAllTimers();

    if (promises.every(p => isPromise(p))) {
      Promise.all(promises)
        .then(names => {
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          expect(lookupMentionNames).toHaveBeenNthCalledWith(1, ['cheese']);
          expect(names[0]).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          expect(names[1]).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          // Ensure all cached (return value not promise)
          const cachedName = mentionNameResolver.lookupName('cheese');
          expect(cachedName).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          done();
        })
        .catch(err => {
          fail(`Promises were rejected ${err}`);
        });
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${promises.map(
          p => typeof p,
        )}`,
      );
    }
    done();
  });

  it('lookup twice when not cached, but first request is "processing"', done => {
    let delayedResolve: any;
    const delayedPromise = new Promise(resolve => {
      delayedResolve = resolve;
    });
    lookupMentionNames.mockReturnValueOnce(delayedPromise);
    lookupMentionNames.mockReturnValue(
      Promise.reject('only one call expected'),
    );

    const promise1 = mentionNameResolver.lookupName('cheese');
    jest.runAllTimers();

    expect(lookupMentionNames).toHaveBeenCalledTimes(1);

    // Second request after first request sent to service, but not returned
    const promise2 = mentionNameResolver.lookupName('cheese');

    const promises = [promise1, promise2];

    delayedResolve([
      {
        id: 'cheese',
        name: 'bacon',
        status: MentionNameStatus.OK,
      },
    ]);

    if (promises.every(p => isPromise(p))) {
      Promise.all(promises)
        .then(names => {
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          expect(names[0]).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          expect(names[1]).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          // Ensure all cached (return value not promise)
          const cachedName = mentionNameResolver.lookupName('cheese');
          expect(cachedName).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          done();
        })
        .catch(err => {
          fail(`Promises were rejected ${err}`);
        });
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${promises.map(
          p => typeof p,
        )}`,
      );
    }
    done();
  });

  it("processes queue if it's reached the queue limit", done => {
    lookupMentionNames.mockReturnValueOnce(
      Promise.resolve([
        {
          id: 'cheese',
          name: 'bacon',
          status: MentionNameStatus.OK,
        },
        {
          id: 'ham',
          name: 'mustard',
          status: MentionNameStatus.OK,
        },
      ]),
    );
    lookupMentionNames.mockRejectedValue('unexpected call');
    const promises = [
      mentionNameResolver.lookupName('cheese'),
      mentionNameResolver.lookupName('ham'),
    ];

    // No need to run timers - should occur immediately

    if (promises.every(p => isPromise(p))) {
      Promise.all(promises)
        .then(names => {
          expect(lookupMentionNames).toHaveBeenCalledTimes(1);
          expect(lookupMentionNames).toHaveBeenNthCalledWith(1, [
            'cheese',
            'ham',
          ]);
          expect(names[0]).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          expect(names[1]).toEqual({
            id: 'ham',
            name: 'mustard',
            status: MentionNameStatus.OK,
          });
          // Ensure all cached (return value not promise)
          let cachedName = mentionNameResolver.lookupName('cheese');
          expect(cachedName).toEqual({
            id: 'cheese',
            name: 'bacon',
            status: MentionNameStatus.OK,
          });
          cachedName = mentionNameResolver.lookupName('ham');
          expect(cachedName).toEqual({
            id: 'ham',
            name: 'mustard',
            status: MentionNameStatus.OK,
          });
          done();
        })
        .catch(err => {
          fail(`Promises were rejected ${err}`);
        });
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${promises.map(
          p => typeof p,
        )}`,
      );
    }
    done();
  });
});
