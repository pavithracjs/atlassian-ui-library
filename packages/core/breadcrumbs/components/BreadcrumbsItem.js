import * as tslib_1 from 'tslib';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import AKTooltip from '@atlaskit/tooltip';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import ItemWrapper from '../styled/BreadcrumbsItem';
import Button from '../styled/Button';
import Separator from '../styled/Separator';
var BreadcrumbsItem = /** @class */ (function(_super) {
  tslib_1.__extends(BreadcrumbsItem, _super);
  function BreadcrumbsItem() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    // eslint-disable-line react/sort-comp
    _this.button = null;
    _this.state = { hasOverflow: false };
    _this.renderButton = function() {
      var _a = _this.props,
        href = _a.href,
        iconAfter = _a.iconAfter,
        iconBefore = _a.iconBefore,
        onClick = _a.onClick,
        target = _a.target,
        text = _a.text,
        truncationWidth = _a.truncationWidth,
        component = _a.component;
      var hasOverflow = _this.state.hasOverflow;
      return React.createElement(
        Button,
        {
          truncationWidth: truncationWidth,
          appearance: 'subtle-link',
          iconAfter: truncationWidth && hasOverflow ? undefined : iconAfter,
          iconBefore: truncationWidth && hasOverflow ? undefined : iconBefore,
          onClick: onClick,
          spacing: 'none',
          href: href,
          target: target,
          ref: function(el) {
            _this.button = el;
          },
          component: component,
          analyticsContext: {
            componentName: 'breadcrumbsItem',
            packageName: packageName,
            packageVersion: packageVersion,
          },
        },
        text,
      );
    };
    _this.renderButtonWithTooltip = function() {
      return React.createElement(
        AKTooltip,
        { content: _this.props.text, position: 'bottom' },
        _this.renderButton(),
      );
    };
    return _this;
  }
  BreadcrumbsItem.prototype.componentDidMount = function() {
    this.updateOverflow();
  };
  BreadcrumbsItem.prototype.componentWillReceiveProps = function() {
    // Reset the state
    this.setState({ hasOverflow: false });
  };
  BreadcrumbsItem.prototype.componentDidUpdate = function() {
    this.updateOverflow();
  };
  BreadcrumbsItem.prototype.updateOverflow = function() {
    var truncationWidth = this.props.truncationWidth;
    var button = this.button;
    if (truncationWidth && button) {
      // We need to find the DOM node for the button component in order to measure its size.
      var el = ReactDOM.findDOMNode(button); // eslint-disable-line react/no-find-dom-node
      if (!el || !(el instanceof HTMLElement)) {
        // eslint-disable-next-line no-console
        console.warn(
          'Could not find button included in breadcrumb when calculating overflow',
        );
        return false;
      }
      var overflow = el.clientWidth >= truncationWidth;
      if (overflow !== this.state.hasOverflow) {
        this.setState({ hasOverflow: overflow });
      }
      return overflow;
    }
    return false;
  };
  BreadcrumbsItem.prototype.render = function() {
    var _a = this.props,
      hasSeparator = _a.hasSeparator,
      truncationWidth = _a.truncationWidth;
    var hasOverflow = this.state.hasOverflow;
    return React.createElement(
      ItemWrapper,
      null,
      hasOverflow && truncationWidth
        ? this.renderButtonWithTooltip()
        : this.renderButton(),
      hasSeparator ? React.createElement(Separator, null, '/') : null,
    );
  };
  BreadcrumbsItem.defaultProps = {
    component: undefined,
    hasSeparator: false,
    href: '#',
    truncationWidth: 0,
    onClick: function() {},
    target: '',
  };
  return BreadcrumbsItem;
})(React.Component);
export { BreadcrumbsItem as BreadcrumbsItemWithoutAnalytics };
var createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsEvents({
  onClick: createAndFireEventOnAtlaskit({
    action: 'clicked',
    actionSubject: 'breadcrumbsItem',
    attributes: {
      componentName: 'breadcrumbsItem',
      packageName: packageName,
      packageVersion: packageVersion,
    },
  }),
})(BreadcrumbsItem);
//# sourceMappingURL=BreadcrumbsItem.js.map
