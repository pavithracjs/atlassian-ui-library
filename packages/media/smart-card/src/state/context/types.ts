import { CardStore, CardConnections } from '../store/types';
import CardClient from '../../client';
import { Store } from 'redux';

export interface CardContext {
  store: Store<CardStore>;
  connections: CardConnections;
  config: CardProviderCacheOpts;
}

export interface CardProviderCacheOpts {
  maxAge: number;
  maxLoadingDelay: number;
}

export interface CardProviderStoreOpts {
  initialState: CardStore;
}

export interface CardProviderProps {
  client?: CardClient;
  cacheOptions?: CardProviderCacheOpts;
  storeOptions?: CardProviderStoreOpts;
  children: React.ReactNode;
}
