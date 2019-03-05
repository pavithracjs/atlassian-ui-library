// @flow
/* eslint-disable camelcase */
import { colors, hex2rgba } from '@atlaskit/theme';

export const spacing_content_default_maxwidth_default = '100%';
export const spacing_content_default_margin_default = '4px';
export const animation_content_default_property = 'opacity';
export const animation_content_default_duration = '0.3s';

export const spacing_group_default_margin_default = '4px';
export const spacing_wrapper_default_maxwidth_default = '100%';

export const typography_icon_default_size_default = '0px';
export const spacing_icon_default_lineheight_default = '0px';
export const spacing_icon_default_margin_onlychild = '2px';
export const spacing_icon_nospacing_margin_onlychild = '0px';
export const spacing_icon_default_margin_sibling = '4px';
export const animation_icon_default_property = 'opacity';
export const animation_icon_default_duration = '0.3s';

// Default
export const color_button_default_background_default_light = colors.N20A;
export const color_button_default_background_default_dark = colors.DN70;
export const color_button_default_background_hover_light = colors.N30A;
export const color_button_default_background_hover_dark = colors.DN60;
export const color_button_default_background_active_light = hex2rgba(
  colors.B75,
  0.6,
);
export const color_button_default_background_active_dark = colors.B75;
export const color_button_default_background_disabled_light = colors.N20A;
export const color_button_default_background_disabled_dark = colors.DN70;
export const color_button_default_background_selected_light = colors.N700;
export const color_button_default_background_selected_dark = colors.DN0;
export const color_button_default_background_focusSelected_light = colors.N700;
export const color_button_default_background_focusSelected_dark = colors.DN0;

export const color_button_default_boxshadow_focus_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_default_boxshadow_focus_dark = colors.B75;
export const color_button_default_boxshadow_focusselected_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_default_boxshadow_focusselected_dark = colors.B75;

export const color_button_default_text_default_light = colors.N400;
export const color_button_default_text_default_dark = colors.DN400;
export const color_button_default_text_active_light = colors.B400;
export const color_button_default_text_active_dark = colors.B400;
export const color_button_default_text_disabled_light = colors.N70;
export const color_button_default_text_disabled_dark = colors.DN30;
export const color_button_default_text_selected_light = colors.N20;
export const color_button_default_text_selected_dark = colors.DN400;
export const color_button_default_text_focusSelected_light = colors.N20;
export const color_button_default_text_focusSelected_dark = colors.DN400;

// Primary
// background
export const color_button_primary_background_default_light = colors.B400;
export const color_button_primary_background_default_dark = colors.B100;
export const color_button_primary_background_hover_light = colors.B300;
export const color_button_primary_background_hover_dark = colors.B75;
export const color_button_primary_background_active_light = colors.B500;
export const color_button_primary_background_active_dark = colors.B200;
export const color_button_primary_background_disabled_light = colors.N20A;
export const color_button_primary_background_disabled_dark = colors.DN70;
export const color_button_primary_background_selected_light = colors.N700;
export const color_button_primary_background_selected_dark = colors.DN0;
export const color_button_primary_background_focusSelected_light = colors.N700;
export const color_button_primary_background_focusSelected_dark = colors.DN0;
// boxshadow
export const color_button_primary_boxshadow_focus_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_primary_boxshadow_focus_dark = colors.B75;
export const color_button_primary_boxshadow_focusSelected_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_primary_boxshadow_focusSelected_dark = colors.B75;
// text
export const color_button_primary_text_default_light = colors.N0;
export const color_button_primary_text_default_dark = colors.DN30;
export const color_button_primary_text_disabled_light = colors.N7;
export const color_button_primary_text_disabled_dark = colors.DN30;
export const color_button_primary_text_selected_light = colors.N20;
export const color_button_primary_text_selected_dark = colors.DN400;
export const color_button_primary_text_focusSelected_light = colors.N20;
export const color_button_primary_text_focusSelected_dark = colors.DN400;

// Warning
export const color_button_warning_background_default_light = colors.Y300;
export const color_button_warning_background_default_dark = colors.Y300;
export const color_button_warning_background_hover_light = colors.Y200;
export const color_button_warning_background_hover_dark = colors.Y200;
export const color_button_warning_background_active_light = colors.Y400;
export const color_button_warning_background_active_dark = colors.Y400;
export const color_button_warning_background_disabled_light = colors.N20A;
export const color_button_warning_background_disabled_dark = colors.DN70;
export const color_button_warning_background_selected_light = colors.Y400;
export const color_button_warning_background_selected_dark = colors.Y400;
export const color_button_warning_background_focusSelected_light = colors.Y400;
export const color_button_warning_background_focusSelected_dark = colors.Y400;

export const color_button_warning_boxShadowColor_focus_dark = colors.Y500;
export const color_button_warning_boxShadowColor_focus_light = colors.Y500;
export const color_button_warning_boxShadowColor_focusSelected_dark =
  colors.Y500;
export const color_button_warning_boxShadowColor_focusSelected_light =
  colors.Y500;
export const color_button_warning_color_default_light = colors.N800;
export const color_button_warning_color_default_dark = colors.N800;
export const color_button_warning_color_disabled_light = colors.N70;
export const color_button_warning_color_disabled_dark = colors.DN30;
export const color_button_warning_color_selected_light = colors.N800;
export const color_button_warning_color_selected_dark = colors.N800;
export const color_button_warning_color_focusSelected_light = colors.N800;
export const color_button_warning_color_focusSelected_dark = colors.N800;

// Danger
export const color_button_danger_background_default_light = colors.R400;
export const color_button_danger_background_default_dark = colors.R400;
export const color_button_danger_background_hover_light = colors.R300;
export const color_button_danger_background_hover_dark = colors.R300;
export const color_button_danger_background_active_light = colors.R500;
export const color_button_danger_background_active_dark = colors.R500;
export const color_button_danger_background_disabled_light = colors.N20A;
export const color_button_danger_background_disabled_dark = colors.DN70;
export const color_button_danger_background_selected_light = colors.R500;
export const color_button_danger_background_selected_dark = colors.R500;
export const color_button_danger_background_focusSelected_light = colors.R500;
export const color_button_danger_background_focusSelected_dark = colors.R500;

export const color_button_danger_boxshadow_focus_light = colors.R100;
export const color_button_danger_boxshadow_focus_dark = colors.R100;
export const color_button_danger_boxshadow_focusSelected_light = colors.R100;
export const color_button_danger_boxshadow_focusSelected_dark = colors.R100;

export const color_button_danger_text_default_light = colors.N0;
export const color_button_danger_text_default_dark = colors.N0;
export const color_button_danger_text_disabled_light = colors.N70;
export const color_button_danger_text_disabled_dark = colors.DN30;
export const color_button_danger_text_selected_light = colors.N0;
export const color_button_danger_text_selected_dark = colors.N0;
export const color_button_danger_text_focusSelected_light = colors.N0;
export const color_button_danger_text_focusSelected_dark = colors.N0;

// Help
export const color_button_help_background_default_light = colors.P400;
export const color_button_help_background_default_dark = colors.P400;
export const color_button_help_background_hover_light = colors.P200;
export const color_button_help_background_hover_dark = colors.P200;
export const color_button_help_background_active_light = colors.P500;
export const color_button_help_background_active_dark = colors.P500;
export const color_button_help_background_disabled_light = colors.N20A;
export const color_button_help_background_disabled_dark = colors.DN70;
export const color_button_help_background_selected_light = colors.N700;
export const color_button_help_background_selected_dark = colors.DN0;
export const color_button_help_background_focusSelected_light = colors.R500;
export const color_button_help_background_focusSelected_dark = colors.R500;

export const color_button_help_boxShadow_focus_light = colors.P100;
export const color_button_help_boxShadow_focus_dark = colors.P100;
export const color_button_help_boxShadow_focusSelected_light = colors.P100;
export const color_button_help_boxShadow_focusSelected_dark = colors.P100;

export const color_button_help_text_default_light = colors.N0;
export const color_button_help_text_default_dark = colors.N0;
export const color_button_help_text_disabled_light = colors.N70;
export const color_button_help_text_disabled_dark = colors.DN30;
export const color_button_help_text_selected_light = colors.N20;
export const color_button_help_text_selected_dark = colors.DN400;
export const color_button_help_text_focusSelected_light = colors.N0;
export const color_button_help_text_focusSelected_dark = colors.N0;

// Link
export const color_button_link_background_default_light = 'none';
export const color_button_link_background_default_dark = 'none';
export const color_button_link_background_selected_light = colors.N700;
export const color_button_link_background_selected_dark = colors.N20;
export const color_button_link_background_focusSelected_light = colors.N700;
export const color_button_link_background_focusSelected_dark = colors.N20;

export const color_button_link_boxShadow_focus_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_link_boxShadow_focus_dark = colors.B75;
export const color_button_link_boxShadow_focusSelected_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_link_boxShadow_focusSelected_dark = colors.B75;

export const color_button_link_text_default_light = colors.B400;
export const color_button_link_text_default_dark = colors.B100;
export const color_button_link_text_hover_light = colors.B300;
export const color_button_link_text_hover_dark = colors.B75;
export const color_button_link_text_active_light = colors.B500;
export const color_button_link_text_active_dark = colors.B200;
export const color_button_link_text_disabled_light = colors.N70;
export const color_button_link_text_disabled_dark = colors.DN100;
export const color_button_link_text_selected_light = colors.N20;
export const color_button_link_text_selected_dark = colors.N700;
export const color_button_link_text_focusSelected_light = colors.N20;
export const color_button_link_text_focusSelected_dark = colors.N700;

export const spacing_button_link_textDecoration_hover = 'underline';

// Subtle

export const color_button_subtle_background_default_dark = 'none';
export const color_button_subtle_background_default_light = 'none';
export const color_button_subtle_background_hover_dark = colors.DN60;
export const color_button_subtle_background_hover_light = colors.N30A;
export const color_button_subtle_background_active_dark = colors.B75;
export const color_button_subtle_background_active_light = hex2rgba(
  colors.B75,
  0.6,
);
export const color_button_subtle_background_disabled_dark = 'none';
export const color_button_subtle_background_disabled_light = 'none';
export const color_button_subtle_background_selected_dark = colors.DN0;
export const color_button_subtle_background_selected_light = colors.N700;
export const color_button_subtle_background_focusSelected_dark = colors.DN0;
export const color_button_subtle_background_focusSelected_light = colors.N700;

export const color_button_subtle_boxShadow_focus_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_subtle_boxShadow_focus_dark = colors.B75;
export const color_button_subtle_boxShadow_focusSelected_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_subtle_boxShadow_focusSelected_dark = colors.B75;

export const color_button_subtle_text_default_light = colors.N400;
export const color_button_subtle_text_default_dark = colors.DN400;
export const color_button_subtle_text_active_light = colors.B400;
export const color_button_subtle_text_active_dark = colors.B400;
export const color_button_subtle_text_disabled_light = colors.N70;
export const color_button_subtle_text_disabled_dark = colors.DN100;
export const color_button_subtle_text_selected_light = colors.N20;
export const color_button_subtle_text_selected_dark = colors.DN400;
export const color_button_subtle_text_focusSelected_light = colors.N20;
export const color_button_subtle_text_focusSelected_dark = colors.DN400;

export const color_button_subtlelink_background_default_light = 'none';
export const color_button_subtlelink_background_default_dark = 'none';
export const color_button_subtlelink_background_selected_light = colors.N700;
export const color_button_subtlelink_background_selected_dark = colors.N20;
export const color_button_subtlelink_background_focusSelected_light =
  colors.N700;
export const color_button_subtlelink_background_focusSelected_dark = colors.N20;

export const color_button_subtlelink_boxShadow_focus_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_subtlelink_boxShadow_focus_dark = colors.B75;
export const color_button_subtlelink_boxShadow_focusSelected_light = hex2rgba(
  colors.B200,
  0.6,
);
export const color_button_subtlelink_boxShadow_focusSelected_dark = colors.B75;

export const color_button_subtlelink_text_default_light = colors.N200;
export const color_button_subtlelink_text_default_dark = colors.DN400;
export const color_button_subtlelink_text_hover_light = colors.N90;
export const color_button_subtlelink_text_hover_dark = colors.B50;
export const color_button_subtlelink_text_active_light = colors.N400;
export const color_button_subtlelink_text_active_dark = colors.DN300;
export const color_button_subtlelink_text_disabled_light = colors.N70;
export const color_button_subtlelink_text_disabled_dark = colors.DN100;
export const color_button_subtlelink_text_selected_light = colors.N20;
export const color_button_subtlelink_text_selected_dark = colors.DN400;
export const color_button_subtlelink_text_focusSelected_light = colors.N20;
export const color_button_subtlelink_text_focusSelected_dark = colors.DN400;

export const spacing_button_subtlelink_textDecoration_hover = 'underline';
