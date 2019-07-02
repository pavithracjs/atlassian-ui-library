import { getExtensionHandler } from '../../../utils/extension-handler';

describe('@atlaskit/editor-common extension handler utils', () => {
  it('should return the render handler function from an Extension type', () => {
    const renderFn = jest.fn();
    const extension = {
      render: renderFn,
    };
    const result = getExtensionHandler(extension);
    expect(result).toBe(renderFn);
  });

  it('should return the ExtensionHandler when given an ExtensionHandler', () => {
    const extensionHandler = jest.fn();
    const result = getExtensionHandler(extensionHandler);
    expect(result).toBe(extensionHandler);
  });
});
