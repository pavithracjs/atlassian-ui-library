import {
  B50,
  B400,
  R50,
  R400,
  Y50,
  Y400,
  G50,
  G400,
  P50,
  P400,
} from '@atlaskit/adf-schema';

import { NodeSerializerOpts } from '../interfaces';
import { createTable } from '../util';
import { commonStyle } from '..';

type PanelType = 'info' | 'note' | 'tip' | 'success' | 'warning' | 'error';

type PanelConfig = {
  [K in PanelType]: { background: string; iconColor: string }
};

const config: PanelConfig = {
  info: {
    background: B50,
    iconColor: B400,
  },
  note: {
    background: P50,
    iconColor: P400,
  },
  tip: {
    background: G50,
    iconColor: G400,
  },
  success: {
    background: G50,
    iconColor: G400,
  },
  warning: {
    background: Y50,
    iconColor: Y400,
  },
  error: {
    background: R50,
    iconColor: R400,
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
    padding: '1px 0px 1px 8px',
    margin: `0px`,
    background: config[type] && config[type].background,
  };

  const outerTdCss = {
    ...commonStyle,
    'border-radius': '3px',
    padding: '8px 8px 8px 0px',
    '-webkit-border-radius': '3px',
    '-moz-border-radius': '3px',
    margin: '0px',
    width: '100%',
  };

  const innerTable = createTable([[{ style: innerTdCss, text }]]);
  return createTable([[{ style: outerTdCss, text: innerTable }]]);
}
