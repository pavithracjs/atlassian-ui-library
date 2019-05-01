import * as React from 'react';

export type KeyboardOrMouseEvent =
  | React.MouseEvent<any>
  | React.KeyboardEvent<any>;
export type AppearanceType = 'danger' | 'warning';

export type CustomComponentType = string | React.ComponentType<any>;
