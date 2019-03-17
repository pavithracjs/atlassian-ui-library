import { Mark } from 'prosemirror-model';

export type NodeSerializer = (opts: NodeSerializerOpts) => string;
export type MarkSerializer = (opts: MarkSerializerOpts) => string;

export type Style = { [key: string]: string | number | undefined };

export interface NodeSerializerOpts {
  attrs: { [key: string]: any };
  marks: Mark[];
  text?: string | null;
}

export interface MarkSerializerOpts {
  mark: Mark;
  text: string;
}

export interface SmartCardWithUrlAttributes {
  url: string;
}

interface ScData {
  '@type': string;
  generator: {
    '@type': string;
    name: string;
  };
  name: string;
  url: string;
  summary: string;
}

export interface SmartCardWithDataAttributes {
  data: ScData;
}
