"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmailActionSelectedIcon = function EmailActionSelectedIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"#0052CC\" width=\"20\" height=\"20\" rx=\"2\"/><path d=\"M9.093 14.22a1.281 1.281 0 0 1-1.814 0l-2.903-2.902a1.281 1.281 0 0 1 0-1.814 1.281 1.281 0 0 1 1.814 0L8.186 11.5l5.624-5.624a1.281 1.281 0 0 1 1.814 0 1.281 1.281 0 0 1 0 1.814l-6.53 6.53z\" fill=\"#FFF\"/></g></svg>"
  }, props));
};

EmailActionSelectedIcon.displayName = 'EmailActionSelectedIcon';
var _default = EmailActionSelectedIcon;
exports.default = _default;