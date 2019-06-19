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
import { createTable, createTag, serializeStyle, TableData } from '../util';
import { commonStyle } from '..';
import { createContentId } from '../static';

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
    'font-size': '14px',
    width: '100%',
    padding: '1px 8px 1px 0',
    margin: `0px`,
  };

  const outerTdCss = {
    ...commonStyle,
    padding: '8px 0px 8px 0px',
    margin: '0px',
    width: '100%',
  };

  const panelIcon = createTag('img', {
    style: serializeStyle({
      width: '16px',
      height: '16px',
    }),
    src: createContentId(type, 'icon'),
  });

  const iconTd: TableData = {
    text: panelIcon,
    style: {
      'vertical-align': 'top',
      width: '24px',
      height: '24px',
      padding: '12px 0px 0px 8px',
    },
  };

  const textTd: TableData = {
    text,
    style: innerTdCss,
  };

  const innerTable = createTable([[iconTd, textTd]], {
    background: config[type] && config[type].background,
    'border-radius': '3px',
    '-webkit-border-radius': '3px',
    '-moz-border-radius': '3px',
    'table-layout': 'fixed',
    'line-height': '20px',
  });
  return createTable([[{ style: outerTdCss, text: innerTable }]]);
}
