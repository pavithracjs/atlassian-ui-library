import { LRUCache } from 'lru-fast';
import { Observable } from 'rxjs/Observable';
import { StreamsCache } from '../../file-streams-cache';

describe('StreamsCache', () => {
  it('should return the stream if already exist', () => {
    const cache = new StreamsCache(new LRUCache(10));
    const fileStream1 = Observable.create();

    cache.set('1', fileStream1);

    expect(cache.has('1')).toBeTruthy();
    expect(cache.has('2')).toBeFalsy();
    expect(cache.get('1')).toEqual(fileStream1);
  });
});
