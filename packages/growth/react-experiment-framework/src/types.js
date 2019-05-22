// @flow

export type ExperimentKey = string;

export type EnrollmentDetails = {
  cohort: string,
  isEligible: boolean,
  ineligibilityReasons?: string[],
};

export type ExperimentEnrollmentResolver = (
  options?: ExperimentEnrollmentOptions,
) => EnrollmentDetails | Promise<EnrollmentDetails>;

export type ExperimentDetails = {
  isEnrollmentDecided: boolean,
  enrollmentResolver: ExperimentEnrollmentResolver,
  enrollmentDetails?: EnrollmentDetails,
};

export type Experiments = {
  [ExperimentKey]: ExperimentDetails,
};

export type ExperimentEnrollmentConfig = {
  [ExperimentKey]: ExperimentEnrollmentResolver,
};

export type EnrollmentOptions = {
  [string]: any,
};

export type OptionsResolver = ExperimentKey => EnrollmentOptions;

export type ExperimentEnrollmentOptions = EnrollmentOptions | OptionsResolver;

export type ExperimentContext = {
  experiments: Experiments,
  options?: ExperimentEnrollmentOptions,
};

export type ExposureDetails = EnrollmentDetails & {
  experimentKey: ExperimentKey,
};

export type ResolverPromises = {
  [ExperimentKey]: Promise<EnrollmentDetails>,
};
