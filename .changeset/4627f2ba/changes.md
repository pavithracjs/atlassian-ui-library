- ED-6598: Add initial prop for 'Full Width Mode'

You may now enable our new experimental feature 'Full Width Mode' by passing a new `fullWidthMode` prop.

This prop only takes effect on full-width appearence and this initial implementation is extremely raw as most nodes don't reflect their desired behaviour.

Example:
```
<Editor appearence="full-width" fullWidthMode={true} />
```
