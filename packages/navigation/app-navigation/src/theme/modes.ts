import { B500, DN10, N0, N20 } from '@atlaskit/theme/colors';

import { generateMode } from './modeGenerator';

export const light = generateMode({
  text: N0,
  background: B500,
});

export const dark = generateMode({
  text: N20,
  background: DN10,
});
