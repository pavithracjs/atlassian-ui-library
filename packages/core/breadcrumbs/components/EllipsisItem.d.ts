import * as React from 'react';
interface IProps {
  hasSeparator?: boolean;
  onClick?: (event: React.MouseEvent) => any;
}
export default class EllipsisItem extends React.Component<IProps, {}> {
  static defaultProps: IProps;
  render(): JSX.Element;
}
export {};
