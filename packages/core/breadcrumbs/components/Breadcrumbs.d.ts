import * as React from 'react';
interface IState {
  isExpanded?: boolean;
}
interface IProps {
  maxItems?: number;
}
export default class Breadcrumbs extends React.Component<IProps, IState> {
  state: {
    isExpanded: boolean;
  };
  expand: () => void;
  render(): JSX.Element;
}
export {};
