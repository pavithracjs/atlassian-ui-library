import { Flag, FlagShape, CustomAttributes } from './types';
export default class UntrackedFlag implements Flag {
  flagKey: string;
  value: string | boolean | object;
  constructor(flagKey: string, flag: FlagShape);
  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): boolean;
  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string;
  getJSONValue(): object;
}
