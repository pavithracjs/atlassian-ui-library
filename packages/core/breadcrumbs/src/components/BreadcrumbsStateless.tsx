import * as React from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import EllipsisItem from './EllipsisItem';
import Container from '../styled/BreadcrumbsContainer';

const defaultMaxItems = 8;

const { toArray } = React.Children;

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

type DefaultProps = Pick<
  IProps,
  'isExpanded' | 'maxItems' | 'itemsBeforeCollapse' | 'itemsAfterCollapse'
>;

class BreadcrumbsStateless extends React.Component<IProps, {}> {
  static defaultProps: DefaultProps = {
    isExpanded: false,
    maxItems: defaultMaxItems,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
  };

  renderAllItems(): Array<React.ReactNode> {
    const allNonEmptyItems = toArray(this.props.children);
    return allNonEmptyItems.map((child, index) =>
      React.cloneElement(child as React.ReactElement, {
        hasSeparator: index < allNonEmptyItems.length - 1,
      }),
    );
  }

  renderItemsBeforeAndAfter() {
    const { itemsBeforeCollapse, itemsAfterCollapse } = this.props;

    // Not a chance this will trigger, but TS is complaining about items* possibly beign undefined.
    if (itemsBeforeCollapse === undefined || itemsAfterCollapse === undefined) {
      return;
    }

    const allItems = this.renderAllItems();
    // This defends against someone passing weird data, to ensure that if all
    // items would be shown anyway, we just show all items without the EllipsisItem
    if (itemsBeforeCollapse + itemsAfterCollapse >= allItems.length) {
      return allItems;
    }

    const beforeItems = allItems.slice(0, itemsBeforeCollapse);
    const afterItems = allItems.slice(
      allItems.length - itemsAfterCollapse,
      allItems.length,
    );

    return [
      ...beforeItems,
      <EllipsisItem
        hasSeparator={itemsAfterCollapse > 0}
        key="ellipsis"
        onClick={this.props.onExpand}
      />,
      ...afterItems,
    ];
  }

  render() {
    const { children, isExpanded, maxItems } = this.props;
    if (!children) return <Container />;
    return (
      <Container>
        {isExpanded || (maxItems && toArray(children).length <= maxItems)
          ? this.renderAllItems()
          : this.renderItemsBeforeAndAfter()}
      </Container>
    );
  }
}

export { BreadcrumbsStateless as BreadcrumbsStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'breadcrumbs',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onExpand: createAndFireEventOnAtlaskit({
      action: 'expanded',
      actionSubject: 'breadcrumbs',

      attributes: {
        componentName: 'breadcrumbs',
        packageName,
        packageVersion,
      },
    }),
  })(BreadcrumbsStateless),
);
