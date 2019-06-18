import { useSmartLinkContext } from '../context';
import { CardState } from '../types';
import { useEffect, useState } from 'react';

export function useSmartCardState(url: string): CardState {
  const { store } = useSmartLinkContext();
  // Initially, card state should be pending and 'empty'.
  const initialState = store.getState()[url];
  const [state, setState] = useState<CardState>(
    initialState || {
      status: 'pending',
      lastUpdatedAt: Date.now(),
    },
  );
  // Selector for initial and subsequent states.
  useEffect(
    () => {
      store.subscribe(() => {
        setState(store.getState()[url]);
      });
    },
    [url, store],
  );
  // State for use in view components.
  return state;
}
