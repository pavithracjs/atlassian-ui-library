// @flow
/* eslint-disable camelcase */
import { colors, gridSize, math, themed } from '@atlaskit/theme';

// maybe this should be layout? should it be tokenized at all?
export const spacing_container_error_maxHeight_default = '52px';
export const spacing_container_warning_maxHeight_default = '52px';
export const spacing_container_announcement_maxHeight_default = '88px';

export const color_container_error_background_default_light = colors.R400;
export const color_container_error_background_default_dark = colors.R300;
export const color_container_warning_background_default_light = colors.Y300;
export const color_container_warning_background_default_dark = colors.Y300;
// note: this seems like the 'new' state elsewhere?
export const color_container_announcement_background_default_light =
  colors.N500;
export const color_container_announcement_background_default_dark = colors.N500;

export const color_container_error_text_default_light = colors.N0;
export const color_container_error_text_default_dark = colors.DN40;
export const color_container_warning_text_default_light = colors.N700;
export const color_container_warning_text_default_dark = colors.DN40;
export const color_container_announcement_text_default_light = colors.N0;
export const color_container_announcement_text_default_dark = colors.N0;

export const color_content_error_background_default_light = colors.R400;
export const color_content_error_background_default_dark = colors.R300;
export const color_content_warning_background_default_light = colors.Y300;
export const color_content_warning_background_default_dark = colors.Y300;
export const color_content_announcement_background_default_light = colors.N500;
export const color_content_announcement_background_default_dark = colors.N500;

export const color_content_error_text_default_light = colors.N0;
export const color_content_error_text_default_dark = colors.DN40;
export const color_content_warning_text_default_light = colors.N700;
export const color_content_warning_text_default_dark = colors.DN40;
export const color_content_announcement_text_default_light = colors.N0;
export const color_content_announcement_text_default_dark = colors.N0;

export const color_content_error_fill_default_light = colors.R400;
export const color_content_error_fill_default_dark = colors.R300;
export const color_content_warning_fill_default_light = colors.Y300;
export const color_content_warning_fill_default_dark = colors.Y300;
export const color_content_announcement_fill_default_light = colors.N500;
export const color_content_announcement_fill_default_dark = colors.N500;

export const typography_content_default_fontWeight_default = 500;

export const spacing_content_default_padding_default = `${math.multiply(
  gridSize,
  2,
)}px`;

export const spacing_content_annoucement_maxWidth_default = '876px';

export const animation_content_default_transitionProperty_default = 'color';
export const animation_content_default_transitionDuration_default = '0.25s';
export const animation_content_default_transitionEasing_default = 'ease-in-out';

export const color_contentLink_error_text_default_light = colors.N0;
export const color_contentLink_error_text_default_dark = colors.DN40;
export const color_contentLink_warning_text_default_light = colors.N700;
export const color_contentLink_warning_text_default_dark = colors.DN40;
export const color_contentLink_announcement_text_default_light = colors.N0;
export const color_contentLink_announcement_text_default_dark = colors.N0;

export const color_contentLink_error_text_hover_light = colors.N0;
export const color_contentLink_error_text_hover_dark = colors.DN40;
export const color_contentLink_warning_text_hover_light = colors.N700;
export const color_contentLink_warning_text_hover_dark = colors.DN40;
export const color_contentLink_announcement_text_hover_light = colors.N0;
export const color_contentLink_announcement_text_hover_dark = colors.N0;

export const color_contentLink_error_text_active_light = colors.N0;
export const color_contentLink_error_text_active_dark = colors.DN40;
export const color_contentLink_warning_text_active_light = colors.N700;
export const color_contentLink_warning_text_active_dark = colors.DN40;
export const color_contentLink_announcement_text_active_light = colors.N0;
export const color_contentLink_announcement_text_active_dark = colors.N0;

export const color_contentLink_error_text_focus_light = colors.N0;
export const color_contentLink_error_text_focus_dark = colors.DN40;
export const color_contentLink_warning_text_focus_light = colors.N700;
export const color_contentLink_warning_text_focus_dark = colors.DN40;
export const color_contentLink_announcement_text_focus_light = colors.N0;
export const color_contentLink_announcement_text_focus_dark = colors.N0;

// do we want to include visited as tokens? Also should we tokenize if the values are all the same? They're probably being included for specificity overrides.
export const color_contentLink_error_text_visited_light = colors.N0;
export const color_contentLink_error_text_visited_dark = colors.DN40;
export const color_contentLink_warning_text_visited_light = colors.N700;
export const color_contentLink_warning_text_visited_dark = colors.DN40;
export const color_contentLink_announcement_text_visited_light = colors.N0;
export const color_contentLink_announcement_text_visited_dark = colors.N0;

// what about values that are based on props but have a default value?
export const animation_visibility_default_transitionProperty_default =
  'max-height';
export const animation_visibility_default_transitionDuration_default = '0.25s';
export const animation_visibility_default_transitionEasing_default =
  'ease-in-out';

export const spacing_text_default_paddingLeft_default = `${math.divide(
  gridSize,
  2,
)}px`;
