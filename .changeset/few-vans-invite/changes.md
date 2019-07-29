Allow to pass placeholder to MediaAvatarPicker to render a custom component while it loads

```
import {AvatarPickerDialog} from '@atlaskit/media-avatar-loader'


<AvatarPickerDialog
  placeholder={<div>Avatar picker is loading...</div>}
/>
```

Otherwise still defaults to the existing `ModalSpinner` component