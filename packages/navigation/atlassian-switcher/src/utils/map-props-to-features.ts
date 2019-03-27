import { Feature, FeatureFlagProps } from '../types';

export default function mapPropsToFeatures(props: any): FeatureFlagProps {
  return Object.keys(Feature).reduce(
    (acc, key) => ({
      ...acc,
      [key]: Boolean(props[key]),
    }),
    {},
  ) as FeatureFlagProps;
}
