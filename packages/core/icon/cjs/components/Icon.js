"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var styled_components_1 = tslib_1.__importDefault(require("styled-components"));
var uuid_1 = tslib_1.__importDefault(require("uuid"));
var theme_1 = require("@atlaskit/theme");
var constants_1 = require("../constants");
var getSize = function (_a) {
    var size = _a.size;
    return size ? "height: " + constants_1.sizes[size] + "; width: " + constants_1.sizes[size] + ";" : null;
};
exports.IconWrapper = styled_components_1.default.span(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n  ", " color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", " max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"], ["\n  ", " color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", " max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"])), getSize, function (p) { return p.primaryColor || 'currentColor'; }, function (p) { return p.secondaryColor || theme_1.colors.background; }, getSize);
var Icon = /** @class */ (function (_super) {
    tslib_1.__extends(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* Icons need unique gradient IDs across instances for different gradient definitions to work
     * correctly.
     * A step in the icon build process replaces linear gradient IDs and their references in paths
     * to a placeholder string so we can replace them with a dynamic ID here.
     * Replacing the original IDs with placeholders in the build process is more robust than not
     * using placeholders as we do not have to rely on regular expressions to find specific element
     * to replace.
     */
    Icon.insertDynamicGradientID = function (svgStr) {
        var id = uuid_1.default();
        var replacedSvgStr = svgStr
            .replace(/id="([^"]+)-idPlaceholder"/g, "id=$1-" + id)
            .replace(/fill="url\(#([^"]+)-idPlaceholder\)"/g, "fill=\"url(#$1-" + id + ")\"");
        return replacedSvgStr;
    };
    Icon.prototype.render = function () {
        var _a = this.props, Glyph = _a.glyph, dangerouslySetGlyph = _a.dangerouslySetGlyph, primaryColor = _a.primaryColor, secondaryColor = _a.secondaryColor, size = _a.size;
        // handling the glyphs as strings
        if (dangerouslySetGlyph) {
            return (react_1.default.createElement(exports.IconWrapper, { primaryColor: primaryColor, secondaryColor: secondaryColor, size: size, "aria-label": this.props.label, dangerouslySetInnerHTML: {
                    __html: Icon.insertDynamicGradientID(dangerouslySetGlyph),
                } }));
        }
        // handling the glyphs when passed through as functions
        return (react_1.default.createElement(exports.IconWrapper, { primaryColor: primaryColor, secondaryColor: secondaryColor, size: size, "aria-label": this.props.label }, Glyph ? react_1.default.createElement(Glyph, { role: "presentation" }) : null));
    };
    return Icon;
}(react_1.Component));
exports.default = Icon;
var templateObject_1;
//# sourceMappingURL=Icon.js.map