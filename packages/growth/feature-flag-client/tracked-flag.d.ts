import { FlagShape, Flag, CustomAttributes } from './types';
export default class TrackedFlag implements Flag {
  flagKey: string;
  flag: FlagShape;
  value: string | boolean | object;
  trackExposure: (
    flagKey: string,
    flag: FlagShape,
    exposureData?: CustomAttributes,
  ) => void;
  constructor(
    flagKey: string,
    flag: FlagShape,
    trackExposure: (
      flagKey: string,
      flag: FlagShape,
      exposureData?: CustomAttributes,
    ) => void,
  );
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
