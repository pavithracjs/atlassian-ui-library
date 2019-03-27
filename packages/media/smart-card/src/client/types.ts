import Environments from '../utils/environments';

export interface AuthService {
  id: string;
  name: string;
  startAuthUrl: string;
}

export type PendingState = {
  status: 'pending';
};

export type ResolvingState = {
  status: 'resolving';
};

export type ErroredState = {
  definitionId: undefined;
  status: 'errored';
};

export type NotFoundState = {
  status: 'not-found';
};

export type DefinedStatus = 'resolved' | 'unauthorized' | 'forbidden';

export type DefinedState = {
  status: DefinedStatus;
  definitionId: string;
  services: AuthService[];
  data?: { [name: string]: any };
};

export type ObjectState =
  | PendingState
  | ResolvingState
  | ErroredState
  | NotFoundState
  | DefinedState;

export type ObjectStatus = Pick<ObjectState, 'status'>['status'];

export type CardUpdateCallback<T> = (state: [T | null, boolean]) => void;

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
export type ClientConfig = {
  cacheLifespan?: number;
  getNowTimeFn?: () => number;
  loadingStateDelay?: number;
};

export type ClientEnvironment = {
  resolverURL: string;
};

export type EnvironmentsKeys = keyof typeof Environments;

export interface Client {
  fetchData(url: string): Promise<ResolveResponse>;
}
