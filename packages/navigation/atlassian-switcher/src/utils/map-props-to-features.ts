import { Feature, FeatureFlagProps } from '../types';

const propToFeature = (props: any, key: string) => {
  if (key === Feature.xflow) {
    return typeof props.triggerXFlow === 'function';
  }
  return Boolean(props[key]);
};

export default function mapPropsToFeatures(props: any): FeatureFlagProps {
  return Object.keys(Feature).reduce(
    (acc, key) => ({
      ...acc,
      [key]: propToFeature(props, key),
    }),
    {},
  ) as FeatureFlagProps;
}
