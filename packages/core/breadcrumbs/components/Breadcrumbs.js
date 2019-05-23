import * as tslib_1 from 'tslib';
import * as React from 'react';
import BreadcrumbsStateless from './BreadcrumbsStateless';
var Breadcrumbs = /** @class */ (function(_super) {
  tslib_1.__extends(Breadcrumbs, _super);
  function Breadcrumbs() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.state = { isExpanded: false };
    _this.expand = function() {
      return _this.setState({ isExpanded: true });
    };
    return _this;
  }
  Breadcrumbs.prototype.render = function() {
    return React.createElement(
      BreadcrumbsStateless,
      tslib_1.__assign({}, this.props, {
        isExpanded: this.state.isExpanded,
        onExpand: this.expand,
      }),
    );
  };
  return Breadcrumbs;
})(React.Component);
export default Breadcrumbs;
//# sourceMappingURL=Breadcrumbs.js.map
