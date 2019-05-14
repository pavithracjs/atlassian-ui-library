import * as React from 'react';
declare module 'react-lorem-component' {
  export interface LoremProps {
    count: number | string;
  }

  declare class Lorem extends React.Component<LoremProps> {}
  export default Lorem;
}
