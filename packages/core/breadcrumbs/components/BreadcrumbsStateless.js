import * as tslib_1 from 'tslib';
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
var defaultMaxItems = 8;
var toArray = React.Children.toArray;
var BreadcrumbsStateless = /** @class */ (function(_super) {
  tslib_1.__extends(BreadcrumbsStateless, _super);
  function BreadcrumbsStateless() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  BreadcrumbsStateless.prototype.renderAllItems = function() {
    var allNonEmptyItems = toArray(this.props.children);
    return allNonEmptyItems.map(function(child, index) {
      return React.cloneElement(child, {
        hasSeparator: index < allNonEmptyItems.length - 1,
      });
    });
  };
  BreadcrumbsStateless.prototype.renderItemsBeforeAndAfter = function() {
    var _a = this.props,
      itemsBeforeCollapse = _a.itemsBeforeCollapse,
      itemsAfterCollapse = _a.itemsAfterCollapse;
    // Not a chance this will trigger, but TS is complaining about items* possibly beign undefined.
    if (itemsBeforeCollapse === undefined || itemsAfterCollapse === undefined) {
      return;
    }
    var allItems = this.renderAllItems();
    // This defends against someone passing weird data, to ensure that if all
    // items would be shown anyway, we just show all items without the EllipsisItem
    if (itemsBeforeCollapse + itemsAfterCollapse >= allItems.length) {
      return allItems;
    }
    var beforeItems = allItems.slice(0, itemsBeforeCollapse);
    var afterItems = allItems.slice(
      allItems.length - itemsAfterCollapse,
      allItems.length,
    );
    return tslib_1.__spread(
      beforeItems,
      [
        React.createElement(EllipsisItem, {
          hasSeparator: itemsAfterCollapse > 0,
          key: 'ellipsis',
          onClick: this.props.onExpand,
        }),
      ],
      afterItems,
    );
  };
  BreadcrumbsStateless.prototype.render = function() {
    var _a = this.props,
      children = _a.children,
      isExpanded = _a.isExpanded,
      maxItems = _a.maxItems;
    if (!children) return React.createElement(Container, null);
    return React.createElement(
      Container,
      null,
      isExpanded || (maxItems && toArray(children).length <= maxItems)
        ? this.renderAllItems()
        : this.renderItemsBeforeAndAfter(),
    );
  };
  BreadcrumbsStateless.defaultProps = {
    isExpanded: false,
    maxItems: defaultMaxItems,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
  };
  return BreadcrumbsStateless;
})(React.Component);
export { BreadcrumbsStateless as BreadcrumbsStatelessWithoutAnalytics };
var createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({
  componentName: 'breadcrumbs',
  packageName: packageName,
  packageVersion: packageVersion,
})(
  withAnalyticsEvents({
    onExpand: createAndFireEventOnAtlaskit({
      action: 'expanded',
      actionSubject: 'breadcrumbs',
      attributes: {
        componentName: 'breadcrumbs',
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),
  })(BreadcrumbsStateless),
);
//# sourceMappingURL=BreadcrumbsStateless.js.map
