import * as React from 'react';
import { Client } from '../../client';

export default React.createContext<Client | undefined>(undefined);
