import { B200, B500, DN10, N0, N20 } from '@atlaskit/theme/colors';

import { generateMode } from './modeGenerator';

export const light = generateMode({
  primary: {
    backgroundColor: B500,
    color: N0,
  },
  secondary: {
    backgroundColor: B200,
    color: N0,
  },
});

export const dark = generateMode({
  primary: {
    backgroundColor: DN10,
    color: N20,
  },
  secondary: {
    backgroundColor: N20,
    color: DN10,
  },
});
