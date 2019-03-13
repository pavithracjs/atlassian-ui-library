import { colors } from '@atlaskit/theme';

import { NodeSerializerOpts } from '../interfaces';
import { createTable } from '../util';
import { commonStyle } from '..';

type PanelType = 'info' | 'note' | 'tip' | 'success' | 'warning' | 'error';

type PanelConfig = {
  [K in PanelType]: { background: string; iconColor: string }
};

const config: PanelConfig = {
  info: {
    background: colors.B50,
    iconColor: colors.B400,
  },
  note: {
    background: colors.P50,
    iconColor: colors.P400,
  },
  tip: {
    background: colors.G50,
    iconColor: colors.G400,
  },
  success: {
    background: colors.G50,
    iconColor: colors.G400,
  },
  warning: {
    background: colors.Y50,
    iconColor: colors.Y400,
  },
  error: {
    background: colors.R50,
    iconColor: colors.R400,
  },
};

export default function panel({ attrs, text }: NodeSerializerOpts) {
  const type: PanelType = attrs.panelType;

  const innerTdCss = {
    ...commonStyle,
    'border-radius': '3px',
    '-webkit-border-radius': '3px',
    '-moz-border-radius': '3px',
    'font-size': '14px',
    width: '100%',
    padding: '2px 0px 2px 8px',
    margin: `0px`,
    background: config[type] && config[type].background,
  };

  const outerTdCss = {
    ...commonStyle,
    'border-radius': '3px',
    padding: '4px 12px 4px 0',
    '-webkit-border-radius': '3px',
    '-moz-border-radius': '3px',
    margin: '0px',
    width: '100%',
  };

  const innerTable = createTable([[{ style: innerTdCss, text }]]);
  return createTable([[{ style: outerTdCss, text: innerTable }]]);
}
