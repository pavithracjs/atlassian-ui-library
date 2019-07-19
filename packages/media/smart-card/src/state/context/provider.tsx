import * as React from 'react';
import { useContext } from 'react';
import { createStore, Reducer } from 'redux';
import { cardReducer } from '../reducers';
import { SmartCardContext } from '.';
import { CardProviderProps } from './types';
import { MAX_RELOAD_DELAY, MAX_LOADING_DELAY } from '../actions/constants';
import { CardStore } from '../types';
import CardClient from '../../client';

export function SmartCardProvider({
  client = new CardClient(),
  cacheOptions = {
    maxAge: MAX_RELOAD_DELAY,
    maxLoadingDelay: MAX_LOADING_DELAY,
  },
  storeOptions = { initialState: {} },
  authFlow = 'oauth2',
  children,
}: CardProviderProps) {
  const context = useContext(SmartCardContext);
  if (context) {
    return (
      <SmartCardContext.Provider value={context}>
        {children}
      </SmartCardContext.Provider>
    );
  } else {
    const { initialState } = storeOptions;
    const store = createStore(cardReducer as Reducer<CardStore>, initialState);
    return (
      <SmartCardContext.Provider
        value={{
          store,
          connections: {
            client,
          },
          config: { ...cacheOptions, authFlow },
        }}
      >
        {children}
      </SmartCardContext.Provider>
    );
  }
}
export { CardProviderProps as ProviderProps };
export default SmartCardProvider;
