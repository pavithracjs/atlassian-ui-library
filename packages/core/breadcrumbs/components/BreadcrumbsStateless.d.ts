import * as React from 'react';
interface IProps {
  /** Override collapsing of the nav when there are more than maxItems */
  isExpanded?: boolean;
  /** Set the maximum number of breadcrumbs to display. When there are more
    than the maximum number, only the first and last will be shown, with an
    ellipsis in between. */
  maxItems?: number;
  /** A function to be called when you are in the collapsed view and click
     the ellpisis. */
  onExpand?: (event: React.MouseEvent) => any;
  /** If max items is exceeded, the number of items to show before the ellipsis */
  itemsBeforeCollapse?: number;
  /** If max items is exceeded, the number of items to show after the ellipsis */
  itemsAfterCollapse?: number;
}
declare type DefaultProps = Pick<
  IProps,
  'isExpanded' | 'maxItems' | 'itemsBeforeCollapse' | 'itemsAfterCollapse'
>;
declare class BreadcrumbsStateless extends React.Component<IProps, {}> {
  static defaultProps: DefaultProps;
  renderAllItems(): Array<React.ReactNode>;
  renderItemsBeforeAndAfter(): React.ReactNode[] | undefined;
  render(): JSX.Element;
}
export { BreadcrumbsStateless as BreadcrumbsStatelessWithoutAnalytics };
declare const _default: React.ComponentType<
  Pick<
    | Pick<
        IProps,
        | 'isExpanded'
        | 'maxItems'
        | 'itemsBeforeCollapse'
        | 'itemsAfterCollapse'
        | 'onExpand'
      >
    | React.PropsWithChildren<
        Pick<
          IProps,
          | 'isExpanded'
          | 'maxItems'
          | 'itemsBeforeCollapse'
          | 'itemsAfterCollapse'
          | 'onExpand'
        >
      >,
    | 'isExpanded'
    | 'maxItems'
    | 'itemsBeforeCollapse'
    | 'itemsAfterCollapse'
    | 'onExpand'
  >
>;
export default _default;
