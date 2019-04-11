###️ Highlights

- **New theming API** - Button now supports the new Atlaskit theming API, which allows for powerful custom theming of Buttons and
  its internal components.
- **Speed improvements** - Button has been re-written from the ground up - on heavy-load benchmarks, Button is twice as fast
  (taking 48% of the time to load).
- **Emotion support** - Button is now built using Emotion 10! This is part of a wider push
  for Emotion across all Atlaskit components.

### Breaking Changes:

- The old theming API is no longer supported.
- Styling a Button using Styled Components is no longer supported.
- Button exports a Theme to use as context instead of using Styled Components' ThemeProvider.
- Camel-case ARIA props have been renamed (**ariaExpanded**, **ariaHaspopup** and **ariaLabel**).

See the [upgrade guide](atlaskit.atlassian.com/packages/core/button/docs/upgrade-guide) for more details
