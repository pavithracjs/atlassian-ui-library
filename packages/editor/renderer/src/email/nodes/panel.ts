import { colors } from '@atlaskit/theme';

import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle, createOutlookSpacingHackTd } from '../util';
import { commonStyle } from '..';
import text from './text';

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

const tableAttrs = {
  align: 'left',
  valign: 'top',
  cellpadding: 0,
  border: 0,
  cellspacing: 0,
};

export default function panel({ attrs, text }: NodeSerializerOpts) {
  const type: PanelType = attrs.panelType;

  const innerTdCss = serializeStyle({
    ...commonStyle,
    'border-radius': '3px',
    '-webkit-border-radius': '3px',
    '-moz-border-radius': '3px',
    'font-size': '14px',
    width: '100%',
    padding: '1px 0px 1px 8px',
    margin: `0px`,
    background: config[type] && config[type].background,
  });

  const outerTdCss = serializeStyle({
    ...commonStyle,
    'border-radius': '3px',
    padding: '8px 8px 8px 8px',
    '-webkit-border-radius': '3px',
    '-moz-border-radius': '3px',
    margin: '0px',
    width: '100%',
  });

  const tableStyle = serializeStyle({
    ...commonStyle,
    margin: 0,
    padding: 0,
    width: '100%',
    'border-spacing': '0px',
  });

  const spacingHack = createOutlookSpacingHackTd(tableAttrs);
  const innerTd = createTag('td', { ...tableAttrs, style: innerTdCss }, text);
  const innerTable = createTag(
    'table',
    { ...tableAttrs, style: tableStyle },
    spacingHack + innerTd,
  );

  const outerTd = createTag(
    'td',
    { ...tableAttrs, style: outerTdCss },
    innerTable,
  );
  const outerTable = createTag(
    'table',
    { ...tableAttrs, style: tableStyle },
    outerTd,
  );

  return outerTable;
}
