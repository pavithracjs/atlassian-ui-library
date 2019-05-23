import * as React from 'react';
interface IProps {
  /** Whether this item will be followed by a separator. */
  hasSeparator?: boolean;
  /** The url or path which the breadcrumb should act as a link to. */
  href?: string;
  /** An icon to display before the breadcrumb. */
  iconBefore?: React.ReactChild;
  /** An icon to display after the breadcrumb. */
  iconAfter?: React.ReactChild;
  /** Handler to be called on click. **/
  onClick?: (event: React.MouseEvent) => void;
  /** The text to appear within the breadcrumb as a link. */
  text: string;
  /** The maximum width in pixels that an item can have before it is truncated.
    If this is not set, truncation will only occur when it cannot fit alone on a
    line. If there is no truncationWidth, tooltips are not provided on truncation. */
  truncationWidth?: number;
  target?: '_blank' | '_parent' | '_self' | '_top' | '';
  /** Provide a custom component to use instead of the default button.
   *  The custom component should accept a className prop so it can be styled
   *  and possibly all action handlers */
  component?: React.ComponentType;
}
interface IState {
  hasOverflow: boolean;
}
declare type DefaultProps = Pick<
  IProps,
  | 'component'
  | 'hasSeparator'
  | 'href'
  | 'truncationWidth'
  | 'onClick'
  | 'target'
>;
declare class BreadcrumbsItem extends React.Component<IProps, IState> {
  button: any;
  static defaultProps: DefaultProps;
  state: {
    hasOverflow: boolean;
  };
  componentDidMount(): void;
  componentWillReceiveProps(): void;
  componentDidUpdate(): void;
  updateOverflow(): boolean;
  renderButton: () => JSX.Element;
  renderButtonWithTooltip: () => JSX.Element;
  render(): JSX.Element;
}
export { BreadcrumbsItem as BreadcrumbsItemWithoutAnalytics };
declare const _default: React.ComponentType<
  Pick<
    IProps,
    | 'href'
    | 'target'
    | 'onClick'
    | 'component'
    | 'iconAfter'
    | 'iconBefore'
    | 'text'
    | 'truncationWidth'
    | 'hasSeparator'
  >
>;
export default _default;
