import {
  AnalyticsHandler,
  Flags,
  ExposureEvent,
  FlagShape,
  CustomAttributes,
} from './types';
import TrackedFlag from './tracked-flag';
import UntrackedFlag from './untracked-flag';
export default class FeatureFlagClient {
  flags: Readonly<Flags>;
  trackedFlags: {
    [flagKey: string]: boolean;
  };
  analyticsHandler?: AnalyticsHandler;
  constructor(options: {
    flags?: Flags;
    analyticsHandler: (event: ExposureEvent) => void;
  });
  setFlags(flags: Flags): void;
  setAnalyticsHandler(analyticsHandler: AnalyticsHandler): void;
  getFlag(flagKey: string): TrackedFlag | UntrackedFlag | null;
  clear(): void;
  getBooleanValue(
    flagKey: string,
    options: {
      default: boolean;
      shouldTrackExposureEvent?: boolean;
      exposureData?: CustomAttributes;
    },
  ): boolean;
  getVariantValue(
    flagKey: string,
    options: {
      default: string;
      oneOf: string[];
      shouldTrackExposureEvent?: boolean;
      exposureData?: CustomAttributes;
    },
  ): string;
  getJSONValue(flagKey: string): object;
  trackExposure: (
    flagKey: string,
    flag: FlagShape,
    exposureData?: CustomAttributes,
  ) => void;
}
