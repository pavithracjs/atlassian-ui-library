Modal-dialog has been migrated from styled-components to Emotion (v10)

**BREAKING**

Emotion 10 does not provide support for [Enzyme shallow rendering](https://airbnb.io/enzyme/docs/api/shallow.html). This is due to the fact that uses it's own [JSX pragma](https://emotion.sh/docs/css-prop#jsx-pragma) to support the [CSS prop](https://emotion.sh/docs/css-prop). The pragma internally wraps components and attaches a sibling style tag. Consequently, these implementation details may now be visible as conflicts in your snapshot tests and may be the cause of test failures for cases dependant on a specific DOM structure.

If you are using Enzyme to test components dependent on Modal-Dialog, you may need to replace calls to [shallow()](https://airbnb.io/enzyme/docs/api/shallow.html) with a call to [mount()](https://airbnb.io/enzyme/docs/api/mount.html) instead.

For more information please see: [Migrating to Emotion 10](https://emotion.sh/docs/migrating-to-emotion-10)

**Change Notes**

- styled-components is no longer a peer-dependency
- Render props Body, Header, Footer and Container continue to get styles applied via className
- Fixes an issue with modal contents that re-rendered on resize
- Fixes an issue with forms losing state
- SSR now works out of the box
