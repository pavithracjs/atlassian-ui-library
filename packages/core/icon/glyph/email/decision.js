"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmailDecisionIcon = function EmailDecisionIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" focusable=\"false\" role=\"presentation\"><path d=\"M5.69 3.334l5.488 5.488c.312.312.489.737.489 1.178v8.334a1.667 1.667 0 0 1-3.334 0V10.69l-5-5V7.5A1.667 1.667 0 0 1 0 7.5V1.667C0 .747.747 0 1.667 0H7.5a1.667 1.667 0 0 1 0 3.334H5.69zM19.51.489a1.665 1.665 0 0 1 0 2.356l-4.166 4.167a1.662 1.662 0 0 1-2.357 0 1.665 1.665 0 0 1 0-2.357L17.155.49a1.665 1.665 0 0 1 2.356 0z\" fill=\"#36B37E\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EmailDecisionIcon.displayName = 'EmailDecisionIcon';
var _default = EmailDecisionIcon;
exports.default = _default;