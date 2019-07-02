import { Extension, ExtensionHandler } from '../types/extension-handler';

export function getExtensionHandler<T>(
  extensionOrExtensionHandler: Extension<T> | ExtensionHandler<T>,
): ExtensionHandler<T> {
  if (typeof extensionOrExtensionHandler === 'object') {
    return extensionOrExtensionHandler.render;
  } else {
    return extensionOrExtensionHandler;
  }
}
