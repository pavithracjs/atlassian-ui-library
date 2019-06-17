"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmailSuccessIcon = function EmailSuccessIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" focusable=\"false\" role=\"presentation\"><g transform=\"translate(-3 -3)\" fill-rule=\"evenodd\"><mask id=\"a\" fill=\"#fff\"><use/></mask><use fill=\"currentColor\"/><g mask=\"url(#a)\" fill=\"#064\"><path d=\"M0 0h24v24H0z\"/></g></g></svg>"
  }, props));
};

EmailSuccessIcon.displayName = 'EmailSuccessIcon';
var _default = EmailSuccessIcon;
exports.default = _default;