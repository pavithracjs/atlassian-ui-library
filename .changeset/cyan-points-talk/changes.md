ED-6806 Move 'calcTableColumnWidths' from adf-schema into editor-common

BREAKING CHANGE

We move 'calcTableColumnWidths' helper from adf-schema into our helper library editor-common, you can use it from editor-common in the same way:

Before: 

```javascript
import { calcTableColumnWidths } from '@atlaskit/adf-schema';
```

Now:

```javascript
import { calcTableColumnWidths } from '@atlaskit/editor-common';
```