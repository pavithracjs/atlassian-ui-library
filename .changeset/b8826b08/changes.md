- Added components entry point allowing consumers to pull in just what they need out of theme (smaller bundle sizes!)

```
import { N500, N0 } from '@atlaskit/theme/colors';
import { focusRing } from '@atlaskit/theme/constants';
import { withTheme } from '@atlaskit/theme/components'; 
```