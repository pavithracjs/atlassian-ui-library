export const mockConsole = console => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  return () => {
    // ignore warnings caused by emotion's server-side rendering approach
    // @ts-ignore
    // eslint-disable-next-line no-console

    const mockCalls = console.error.mock.calls.filter(
      ([f, s]: [any, any]) =>
        !(
          f ===
            'Warning: Did not expect server HTML to contain a <%s> in <%s>.' &&
          s === 'style'
        ),
    );

    return mockCalls;
  };
};
