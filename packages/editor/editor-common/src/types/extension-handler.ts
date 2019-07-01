import { ADNode } from '../';

export interface ExtensionParams<T> {
  extensionKey: string;
  extensionType: string;
  type?: 'extension' | 'inlineExtension' | 'bodiedExtension';
  parameters?: T;
  content?: Object | string; // This would be the original Atlassian Document Format
}

export type ExtensionHandler<T> = (
  ext: ExtensionParams<T>,
  doc: Object,
) => JSX.Element | ADNode[] | null;

export interface Extension<T> {
  render: ExtensionHandler<T>;
  update?: (extensionParameters: T) => Promise<object | undefined>;
}

export interface ExtensionHandlers {
  [key: string]: Extension<any> | ExtensionHandler<any>;
}
