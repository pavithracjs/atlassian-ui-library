import { ReactNode } from 'react';
import { ButtonAppearances } from '@atlaskit/Button';

interface Action {
  onClick?: (e: any) => unknown;
  key?: string;
  text?: ReactNode;
  appearance?: ButtonAppearances;
}

export type Actions = Action[];
