import Environments from '../utils/environments';

export interface CardClient {
  fetchData(url: string): Promise<JsonLd>;
}

export interface CardRequest {
  resourceUrl: string;
  context?: string;
}

export interface CardRequestBatch {
  resourceUrls: CardRequest[];
}

export type JsonLdAuth = {
  key: string;
  displayName: string;
  url: string;
};

export type JsonLdVisibility = 'public' | 'restricted' | 'other' | 'not_found';

export type JsonLdAccess = 'granted' | 'unauthorized' | 'forbidden';

export type JsonLdBatch = Array<JsonLdResponse>;
export type JsonLdResponse = {
  status: number;
  body: JsonLd;
};

export type JsonLd = {
  meta: {
    visibility: JsonLdVisibility;
    access: JsonLdAccess;
    auth: JsonLdAuth[];
    definitionId: string;
  };
  data?: {
    [name: string]: any;
  };
};

export type ClientEnvironment = {
  baseUrl: string;
  resolverUrl: string;
};

export type EnvironmentsKeys = keyof typeof Environments;
