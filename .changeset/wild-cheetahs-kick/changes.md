ED-5137 added heading anchor link

An `allowHeadingAnchorLinks` is added to renderer props, set it to `true` to enable heading anchor link feature
There is also an existing property called `disableHeadingIDs`, when you set both `disableHeadingIDs` and `allowHeadingAnchorLinks` to false, the anchor link button will not display, however the heading anchor id will still be in the DOM.

Note: This feature is only enabled for top level headings(e.g. not nested in other blocks like table).
