import { Node } from 'prosemirror-model';
export * from './extension-handler';
export * from './heading-levels';

export interface Transformer<T> {
  encode(node: Node): T;
  parse(content: T): Node;
}

export interface Providers {
  [key: string]: Promise<any>;
}
