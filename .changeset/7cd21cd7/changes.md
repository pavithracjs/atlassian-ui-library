- ED-5292: add support for custom autoformatting

You can now use the `customAutoformatting` prop to provide a custom autoformatting handler that replaces on particular regex strings.

See (Editor RFC 131: Injectable auto-formatting rules, AutoformattingProvider)[https://product-fabric.atlassian.net/wiki/spaces/E/pages/881141566/Editor+RFC+131+Injectable+auto-formatting+rules+AutoformattingProvider] for more details on how this works.

An example provider `autoformattingProvider` that is used in the storybook example is exported from the `@atlaskit/editor-test-helpers` package. Try typing ED-123.

A simplified provider might look like:

    export const autoformattingProvider: AutoformattingProvider = {
      getRules: () =>
        Promise.resolve({
          '[Ee][Dd]-(\\d+)': (match: string[]): Promise<ADFEntity> => {
            const ticketNumber = match[1];
            return new Promise.resolve({
              type: 'inlineCard',
              attrs: {
                url: 'https://www.atlassian.com/',
              },
            });
          },
        }),
    };

At the moment, only text or `inlineCard` nodes are permitted to be replaced.