import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { merge } from 'rxjs/observable/merge';
import { fromPromise } from 'rxjs/observable/fromPromise';
import fetch$ from './fetch';
import { map } from 'rxjs/operators/map';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { delay } from 'rxjs/operators/delay';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { tap } from 'rxjs/operators/tap';
import { catchError } from 'rxjs/operators/catchError';
import {
  ObjectState,
  DefinedState,
  DefinedStatus,
  ErroredState,
  ObjectStatus,
  AuthService,
  NotFoundState,
  ResolvingState,
} from './types';
import { Store } from './store';
import { StateWatch } from './stateWatcher';

// TODO: add some form of caching so that urls not currently loaded will still be fast

const SERVICE_URL = 'https://api-private.stg.atlassian.com/object-resolver';
const DEFAULT_CACHE_LIFESPAN = 15 * 1000;

export type RemoteResourceAuthConfig = {
  key: string;
  displayName: string;
  url: string;
};

// @see https://product-fabric.atlassian.net/wiki/spaces/CS/pages/279347271/Object+Provider
export type ResolveResponse = {
  meta: {
    visibility: 'public' | 'restricted' | 'other' | 'not_found';
    access: 'granted' | 'unauthorized' | 'forbidden';
    auth: RemoteResourceAuthConfig[];
    definitionId: string;
  };
  data?: {
    [name: string]: any;
  };
};

const convertAuthToService = (auth: {
  key: string;
  displayName: string;
  url: string;
}): AuthService => ({
  id: auth.key,
  name: auth.displayName,
  startAuthUrl: auth.url,
});

const statusByAccess = (
  status: DefinedStatus,
  json: ResolveResponse,
): DefinedState => ({
  status: status,
  definitionId: json.meta.definitionId,
  services: json.meta.auth.map(convertAuthToService),
  data: json.data,
});

const responseToStateMapper = (
  json: ResolveResponse,
): NotFoundState | DefinedState => {
  if (json.meta.visibility === 'not_found') {
    return { status: 'not-found' };
  }
  switch (json.meta.access) {
    case 'forbidden':
      return statusByAccess('forbidden', json);
    case 'unauthorized':
      return statusByAccess('unauthorized', json);
    default:
      return statusByAccess('resolved', json);
  }
};

const filterUrlsByDefId = (
  store: Store<ObjectState>,
  defId: string,
  urls: string[],
): string[] =>
  urls.filter(url => {
    const entry = store.get(url);
    const entryDefId = entry && entry.getProp<DefinedState>('definitionId');
    return entryDefId === defId;
  });

const unresolvedUrls = (store: Store<ObjectState>, urls: string[]): string[] =>
  urls.filter(url => {
    const entry = store.get(url);
    const entryStatus = entry && entry.getProp('status');
    return entryStatus !== 'resolved';
  });

const urlsWithoutDefinitionId = (
  store: Store<ObjectState>,
  urls: string[],
): string[] =>
  urls.filter(url => {
    const entry = store.get(url);
    const defId = entry && entry.getProp<DefinedState>('definitionId');
    return defId === undefined;
  });

const getUrlsToReload = (
  store: Store<ObjectState>,
  definitionIdFromCard?: string,
) => {
  if (definitionIdFromCard) {
    return unresolvedUrls(
      store,
      filterUrlsByDefId(store, definitionIdFromCard, store.getAllUrls()),
    );
  } else {
    return urlsWithoutDefinitionId(store, store.getAllUrls());
  }
};

export type ClientConfig = {
  cacheLifespan?: number;
  getNowTimeFn?: () => number;
  loadingStateDelay?: number;
};

export type ResolveAction = {
  type: 'RESOLVE';
  url: string;
};

export type ReloadAction = {
  type: 'RELOAD';
  url: string;
  definitionIdFromCard?: string;
};

export type ClientAction = ResolveAction | ReloadAction;

export interface Client {
  fetchData(url: string): Promise<ResolveResponse>;
}

export class Client implements Client {
  cacheLifespan: number;
  store: Store<ObjectState>;
  loadingStateDelay: number;
  urlsToResolve$: Subject<ClientAction>;

  constructor(config?: ClientConfig) {
    this.cacheLifespan =
      (config && config.cacheLifespan) || DEFAULT_CACHE_LIFESPAN;
    this.store = new Store<ObjectState>(
      (config && config.getNowTimeFn) || Date.now,
    );
    this.loadingStateDelay = (config && config.loadingStateDelay) || 800;
    this.urlsToResolve$ = new Subject<ClientAction>();

    const unique$ = this.urlsToResolve$.pipe(distinctUntilChanged());

    const fetchData = <A extends ClientAction>(res: {
      cmd: A;
      entry: StateWatch<ObjectState> | undefined;
    }) => {
      const data$ = this.startStreaming(res.cmd.url);
      const resolving$ = of(<ResolvingState>{ status: 'resolving' }).pipe(
        delay(this.loadingStateDelay),
        takeUntil(data$),
      );
      return merge(resolving$, data$).pipe(
        map(state => ({ cmd: res.cmd, state })),
      );
    };

    unique$
      .pipe(
        filter(cmd => cmd.type === 'RESOLVE'),
        map(cmd => ({
          cmd: cmd as ResolveAction,
          entry: this.store.get(cmd.url),
        })),
        filter(res => res.entry !== undefined && res.entry.hasExpired()),
        mergeMap(rec => fetchData<ResolveAction>(rec)),
      )
      .subscribe(rec => {
        this.store.set(rec.cmd.url, rec.state, this.cacheLifespan);
      });

    unique$
      .pipe(
        filter(cmd => cmd.type === 'RELOAD'),
        map(cmd => ({
          cmd: cmd as ReloadAction,
          entry: this.store.get(cmd.url),
        })),
        tap(rec => this.store.get(rec.cmd.url)!.invalidate()),
        mergeMap(rec => fetchData<ReloadAction>(rec)),
        tap(rec => this.store.set(rec.cmd.url, rec.state, this.cacheLifespan)),
        mergeMap(rec =>
          from(
            getUrlsToReload(this.store, rec.cmd.definitionIdFromCard).filter(
              otherUrl => otherUrl !== rec.cmd.url,
            ),
          ).pipe(mergeMap(x => fetchData(x))),
        ),
      )
      .subscribe();

    // const entry = this.store.get(url);

    // if (entry && entry.hasExpired()) {
    //   const data$ = this.startStreaming(url);
    //   const resolving$ = of(<ResolvingState>{ status: 'resolving' }).pipe(
    //     delay(this.loadingStateDelay),
    //     takeUntil(data$),
    //   );

    //   merge(resolving$, data$).subscribe(state => {
    //     this.store.set(url, state, this.cacheLifespan);

    //     if (cb) {
    //       cb();
    //     }
    //   });
    // }
  }

  fetchData(objectUrl: string): Promise<ResolveResponse> {
    return fetch$<ResolveResponse>('post', `${SERVICE_URL}/resolve`, {
      resourceUrl: encodeURI(objectUrl),
    }).toPromise();
  }

  startStreaming(
    objectUrl: string,
  ): Observable<ErroredState | NotFoundState | DefinedState> {
    return fromPromise(this.fetchData(objectUrl)).pipe(
      map(responseToStateMapper),
      catchError(() => of({ status: 'errored' } as ErroredState)),
    );
  }

  /**
   * A card should register itself using this method.
   *
   * We're trying to match a DefinitionId to a bunch of URLs and each URL to a callback.
   *
   * As such, when a card gives us the URL we can fetch data+DefinitionId from the ORS,
   * then use that definitionId to find cards that has to be updated.
   *
   * @param url the url that card holds
   * @param fn the callback that can be called after the data has been resolved for that card.
   */
  register(url: string): StateWatch<ObjectState> {
    if (!this.store.exists(url)) {
      return this.store.init(url);
    }

    return this.store.get(url)!;
  }

  // let's say when a card gets unmounted, we need to "clean-up"
  deregister(url: string, uuid: string): Client {
    const storeEntry = this.store.get(url);

    if (storeEntry) {
      storeEntry.unsubscribe(uuid);
    }

    return this;
  }

  resolve(url: string) {
    if (!this.store.exists(url)) {
      throw new Error('Please, register a smart card before calling get()');
    }

    this.urlsToResolve$.next({
      type: 'RESOLVE',
      url,
    });
  }

  reload(url: string, definitionIdFromCard?: string) {
    //this.store.get(url)!.invalidate();

    this.urlsToResolve$.next({
      type: 'RELOAD',
      url,
      definitionIdFromCard,
    });

    // this.resolve(urlToReload, () => {
    //   getUrlsToReload(this.store, definitionIdFromCard)
    //     .filter(otherUrl => otherUrl !== urlToReload)
    //     .forEach(otherUrl => {
    //       this.store.get(otherUrl)!.invalidate();
    //       this.resolve(otherUrl);
    //     });
    // });
  }
}

export { ObjectStatus, ObjectState, AuthService };
