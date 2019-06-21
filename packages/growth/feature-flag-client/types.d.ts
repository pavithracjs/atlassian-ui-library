export declare type Reason =
  | 'OFF'
  | 'FALLTHROUGH'
  | 'RULE_MATCH'
  | 'TARGET_MATCH'
  | 'INELIGIBLE';
export declare type RuleId = string;
export declare type FlagShape = {
  value: boolean | string | object;
  explanation?: {
    kind: Reason;
    ruleId?: RuleId;
    ruleIndex?: number;
  };
};
export declare type Flags = {
  [flagName: string]: FlagShape;
};
export declare type ReservedAttributes = {
  flagKey: string;
  reason: Reason;
  ruleId?: string;
  value: boolean | string | object;
};
export declare type CustomAttributes = {
  [attributeName: string]: string | number | boolean;
};
export declare type ExposureEventAttributes = ReservedAttributes &
  CustomAttributes;
export declare type ExposureEvent = {
  action: string;
  actionSubject: string;
  attributes: ExposureEventAttributes;
  source: string;
};
export interface FlagConstructor {
  new (
    flagKey: string,
    flag: FlagShape,
    trackExposure: (flagKey: string, flag: FlagShape) => void,
  ): Flag;
}
export interface Flag {
  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    data: CustomAttributes;
  }): boolean;
  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    data: CustomAttributes;
  }): string;
  getJSONValue(): object;
}
export declare type AnalyticsHandler = (event: ExposureEvent) => void;
