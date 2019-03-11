// @flow
import type { ComponentType } from 'react';
import { colors } from '@atlaskit/theme';
import { messaging } from '@atlaskit/design-tokens';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InfoIcon from '@atlaskit/icon/glyph/info';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

type Appearance = {
  backgroundColor: string,
  primaryIconColor: string,
  Icon: ComponentType<*>,
};

const {
  colors: { text, warning, destructive, info, confirmation, change },
} = messaging;

export const baseAppearanceObj: { [string]: Appearance } = {
  info: {
    backgroundColor: info.normal.background.resting,
    Icon: InfoIcon,
    primaryIconColor: info.normal.icon.resting,
  },
  warning: {
    backgroundColor: warning.normal.background.resting,
    Icon: WarningIcon,
    primaryIconColor: warning.normal.icon.resting,
  },
  error: {
    backgroundColor: destructive.normal.background.resting,
    Icon: ErrorIcon,
    primaryIconColor: destructive.normal.icon.resting,
  },
  confirmation: {
    backgroundColor: confirmation.normal.background.resting,
    Icon: CheckCircleIcon,
    primaryIconColor: confirmation.normal.icon.resting,
  },
  change: {
    backgroundColor: change.normal.background.resting,
    Icon: QuestionCircleIcon,
    primaryIconColor: change.normal.icon.resting,
  },
};
