// @flow
/* eslint-disable camelcase */
import { colors, gridSize } from '@atlaskit/theme';

// Control
export const color_control_default_border_default_light = colors.N20;
export const color_control_default_border_focused_light = colors.B100;
export const color_control_error_border_default_light = colors.R400;
export const color_control_success_border_default_light = colors.G400;
export const color_control_default_border_hover = colors.N30;
export const color_control_default_background_hover = colors.N30;
export const color_control_default_background_focus = colors.N0;
export const color_control_default_scrollbar_hover = 'rgba(0, 0, 0, 0.2)';
export const animation_transition_background_duration = '200ms';
export const spacing_control_compact_minheight = gridSize() * 4; // gridSize() = 8;
export const spacing_control_default_minheight = gridSize() * 5; //
export const spacing_control_border_radius = '3px';

// Value Indicator
export const spacing_valueindicator_compact_padding_top = '0';
export const spacing_valueindicator_compact_padding_bottom = '0';
export const spacing_valueindicator_default_padding_top = '2px';
export const spacing_valueindicator_default_padding_bottom = '2px';

// Clear Indicator
export const spacing_clearindicator_compact_padding_right = '2px';
export const spacing_clearindicator_compact_padding_left = '2px';
export const spacing_clearindicator_default_padding_right = '2px';
export const spacing_clearindicator_default_padding_left = '2px';
export const spacing_clearindicator_compact_padding_top = '0';
export const spacing_clearindicator_compact_padding_bottom = '0';
export const spacing_clearindicator_default_padding_top = '6px';
export const spacing_clearindicator_default_padding_bottom = '6px';
export const color_clearindicator_text_default = colors.N70;
export const color_clearindicator_text_hover = colors.N500;

// Loading Indicator
export const spacing_loadingindicator_compact_padding_top_default = '0';
export const spacing_loadingindicator_compact_padding_bottom_default = '0';
export const spacing_loadingindicator_default_padding_top_default = '6px';
export const spacing_loadingindicator_default_padding_bottom_default = '6px';

// Dropdown Indicator
export const color_dropdownindicator_default_text_default = colors.N500;
export const color_dropdownindicator_default_text_disabled = colors.N70;
export const color_dropdownindicator_default_text_hover = colors.N200;
export const spacing_dropdownindicator_compact_padding_top_default = '0';
export const spacing_dropdownindicator_compact_padding_bottom_default = '0';
export const spacing_dropdownindicator_default_padding_top_default = '6px';
export const spacing_dropdownindicator_default_padding_bottom_default = '6px';
export const spacing_dropdownindicator_compact_padding_left_default = '0';
export const spacing_dropdownindicator_compact_padding_right_default = '0';
export const spacing_dropdownindicator_default_padding_left_default = '2px';
export const spacing_dropdownindicator_default_padding_right_default = '2px';

// Option
export const color_option_default_text_selected = colors.N0; // default inherits from menu
export const color_option_default_background_selected = colors.N500;
export const color_option_default_background_focused = colors.N50;
export const spacing_option_default_padding_top = '6px';
export const spacing_option_default_padding_bottom = '6px';

// Placeholder
export const color_placeholder_default_text_default = colors.N0;

// Single Value
export const color_singlevalue_default_text_default = colors.N800;
export const color_singlevalue_default_text_disabled = colors.N70;
export const font_singlevalue_default_lineheight_default = `${gridSize() *
  2}px`; // this should not be a pixel value

// MenuList
export const spacing_menulist_default_padding_top_default = gridSize();
export const spacing_menulist_default_padding_bottom_default = gridSize();

// MultiValue
export const spacing_multivalue_default_borderradius_default = '2px';
export const color_multivalue_default_background_default = colors.N40;
export const color_multivalue_default_text_default = colors.N500;

// MultiValueLabel
export const spacing_multivaluelabel_default_padding__left = '2px';
export const spacing_multivaluelabel_default_padding__right = '2px';
export const spacing_multivaluelabel_default_padding__top = '2px';
export const spacing_multivaluelabel_default_padding__bottom = '2px';

// MultiValueRemove
export const color_multivalueremove_default_background_focused = colors.R75;
export const color_multivalueremove_default_background_hovered = colors.R75;
export const color_multivalueremove_default_text_focused = colors.R400;
export const color_multivalueremove_default_text_hovered = colors.R400;
export const spacing_multivalueremove_default_padding__left = '2px';
export const spacing_multivalueremove_default_padding__right = '2px';
export const spacing_multivalueremove_default_borderradius_topleft = '0px';
export const spacing_multivalueremove_default_borderradius_bottomleft = '0px';
export const spacing_multivalueremove_default_borderradius_bottomright = '2px';
export const spacing_multivalueremove_default_borderradius_topright = '2px';

// InputOption (RadioSelect CheckboxSelect Option Component)
export const color_inputoption_default_box_disabledAndSelected_light =
  colors.B75;
export const color_inputoption_default_box_disabledAndSelected_dark =
  colors.DN200;
export const color_inputoption_default_box_disabled_light = colors.N20A;
export const color_inputoption_default_box_disabled_dark = colors.DN10;
export const color_inputoption_default_box_active_light = colors.B75;
export const color_inputoption_default_box_active_dark = colors.B200;
export const color_inputoption_default_box_focusedAndSelected_light =
  colors.B300;
export const color_inputoption_default_box_focusedAndSelected_dark = colors.B75;
export const color_inputoption_default_box_focused_light = colors.N50A;
export const color_inputoption_default_box_focused_dark = colors.DN30;
export const color_inputoption_default_box_selected_light = colors.blue; // colors.B400;
export const color_inputoption_default_box_selected_dark = colors.blue; // colors.B100;

export const color_inputoption_default_dot_disabledAndSelected_light =
  colors.N70;
export const color_inputoption_default_dot_disabledAndSelected_dark =
  colors.DN10;
export const color_inputoption_default_dot_activeAndSelected_dark = colors.B400;
export const color_inputoption_default_dot_activeAndSelected_light =
  colors.DN10;
export const color_inputoption_default_dot_selected_light = colors.N0;
export const color_inputoption_default_dot_selected_dark = colors.DN10;
export const color_inputoption_default_dot_default_light = 'transparent';
export const color_inputoption_default_dot_default_dark = 'transparent';
export const spacing_inputoption_default_padding__left = `${gridSize() * 2}px`;
export const spacing_inputoption_default_padding__top = '4px';
export const spacing_inputoption_default_padding__bottom = '4px';
export const color_inputoption_default_background_focused = colors.N30;
export const color_inputoption_default_background_active = colors.B50;
export const color_inputoption_default_background_default = 'transparent';
