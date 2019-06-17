"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmailActionDefaultIcon = function EmailActionDefaultIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><path d=\"M1.111 2.217v15.566c0 .611.495 1.106 1.106 1.106h15.566c.611 0 1.106-.495 1.106-1.106V2.217c0-.611-.495-1.106-1.106-1.106H2.217c-.611 0-1.106.495-1.106 1.106zM0 2.217C0 .992.992 0 2.217 0h15.566C19.008 0 20 .992 20 2.217v15.566A2.216 2.216 0 0 1 17.783 20H2.217A2.216 2.216 0 0 1 0 17.783V2.217z\" fill-opacity=\".13\" fill=\"#091E42\" fill-rule=\"nonzero\"/><path d=\"M1.111 2.217v15.566c0 .611.495 1.106 1.106 1.106h15.566c.611 0 1.106-.495 1.106-1.106V2.217c0-.611-.495-1.106-1.106-1.106H2.217c-.611 0-1.106.495-1.106 1.106z\" fill=\"#FFF\"/></g></svg>"
  }, props));
};

EmailActionDefaultIcon.displayName = 'EmailActionDefaultIcon';
var _default = EmailActionDefaultIcon;
exports.default = _default;