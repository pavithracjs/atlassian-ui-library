import { createContext } from 'react';
import { MediaClientConfig } from '.';

export const MediaClientConfigContext = createContext<
  MediaClientConfig | undefined
>(undefined);
