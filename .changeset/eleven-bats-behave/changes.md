ED-6382 Added quick insert option to open the feedback modal dialog in editor

**Interface Changes**
There are also changes in the interface of `Editor` component and `ToolbarFeedback` component.

**`Editor`**
For `Editor` component, a property called `feedbackInfo` is added contains the following properties:

- `product`
- `packageName`
- `packageVersion`
- `labels`

The above properties will provide environmental context for the feedback dialog.

Note that `feedbackInfo` is required to enable editor quick insert option for the feedback dialog.

**`ToolbarFeedback`**
For `ToolbarFeedback` component, the following feedback related properties are deprecated in favour of using the `feedbackInfo` property on Editor.

- `packageName`
- `packageVersion`
- `labels`

**Compatibility**
Existing code using the `ToolbarFeedback` component will still work, there will be not no changes on the feedback dialog behavior. However, in order to enable opening feedback dialog from quick insert menu, you need to add `feedbackInfo` property on `Editor`.

If you have put different value for `packageName`, `packageVersion` and `labels` in both `Editor` and `ToolbarFeedback`, depends on how you opening the feedback dialog, it will use different properties.
For example, if a user opens the feedback dialog using the quick insert menu, the feedback modal will use relevant properties from `Editor` component, otherwise opening from toolbar feedback button will bring up a dialog uses relevant properties from `ToolbarFeedback` component.

**Explanation**
In order to enable opening feedback dialog from the quick insert menu, we need to move the feedback dialog code from ToolbarFeedback to Editor itself, because initialize editor plugin from a UI component is not ideal, and it would be very difficult to get properties from an UI component.
