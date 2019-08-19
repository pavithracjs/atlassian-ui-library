import { validPresenceData } from '../../json-data/presence-valid-info.json';
import { invalidPresenceData } from '../../json-data/presence-invalid-info.json';

declare var require: {
  <T>(path: string): T;
};

export interface PresenceValidInfo {
  data: Data;
}

export interface Data {
  PresenceBulk: PresenceBulk[];
}

export interface PresenceBulk {
  userId: string;
  state: null | string;
  type: null | string;
  date: null | string;
  message: null | string;
  stateMetadata?: string;
}

export const validPresenceData: PresenceValidInfo = validPresenceData as PresenceValidInfo;

export const invalidPresenceData: PresenceValidInfo = invalidPresenceData as PresenceValidInfo;
``;
