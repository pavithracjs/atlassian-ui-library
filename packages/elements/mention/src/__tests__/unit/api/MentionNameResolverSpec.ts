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
    expect(mentionNameClientMock.lookupMentionNames).toHaveBeenCalledTimes(0);
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
    if (isPromise(namePromise)) {
      namePromise.then(name => {
        expect(name).toEqual({
          id: 'cheese',
          name: 'bacon',
          status: MentionNameStatus.OK,
        });
        expect(mentionNameClientMock.lookupMentionNames).toHaveBeenCalledTimes(
          1,
        );
        // Ensure cached
        const name2 = mentionNameResolver.lookupName('cheese');
        expect(name2).toEqual({
          id: 'cheese',
          name: 'bacon',
          status: MentionNameStatus.OK,
        });
        expect(mentionNameClientMock.lookupMentionNames).toHaveBeenCalledTimes(
          1,
        );
        done();
      });
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
    if (isPromise(namePromise)) {
      namePromise.then(name => {
        expect(name).toEqual({
          id: 'cheese',
          status: MentionNameStatus.UNKNOWN,
        });
        expect(mentionNameClientMock.lookupMentionNames).toHaveBeenCalledTimes(
          1,
        );
        done();
      });
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
    if (isPromise(namePromise)) {
      namePromise.then(name => {
        expect(name).toEqual({
          id: 'cheese',
          status: MentionNameStatus.SERVICE_ERROR,
        });
        expect(mentionNameClientMock.lookupMentionNames).toHaveBeenCalledTimes(
          1,
        );
        done();
      });
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${typeof namePromise}`,
      );
    }
  });

  it('lookup when not cached, and error in client', done => {
    lookupMentionNames.mockReturnValue(Promise.reject('bad times'));
    const namePromise = mentionNameResolver.lookupName('cheese');
    if (isPromise(namePromise)) {
      namePromise.then(name => {
        expect(name).toEqual({
          id: 'cheese',
          status: MentionNameStatus.SERVICE_ERROR,
        });
        expect(mentionNameClientMock.lookupMentionNames).toHaveBeenCalledTimes(
          1,
        );
        done();
      });
    } else {
      fail(
        `Return type of lookupName is not a Promise, but a ${typeof namePromise}`,
      );
    }
  });

  it('lookup when not cached, exceed batch size', done => {
    done();
  });

  it('lookup twice when not cached, only one call to client, but both callbacks', done => {
    done();
  });

  it("processes queue if it's reached the queue limit", done => {
    done();
  });
});
