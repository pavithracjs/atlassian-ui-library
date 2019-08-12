import { Feature, FeatureMap, MultiVariateFeature } from '../types';

const propToFeature = (props: any, key: string) => {
  switch (key) {
    case Feature.xflow:
      return typeof props.triggerXFlow === 'function';
    default:
      return Boolean(props[key]);
  }
};

export default function mapPropsToFeatures(props: any): FeatureMap {
  const booleanFeatures = Object.keys(Feature).reduce(
    (acc, key) => ({
      ...acc,
      [key]: propToFeature(props, key),
    }),
    {},
  ) as FeatureMap;

  const multivariateFeatures = Object.keys(MultiVariateFeature).reduce(
    (acc, key) => ({
      ...acc,
      [key]: props[key],
    }),
    {},
  ) as FeatureMap;

  return {
    ...booleanFeatures,
    ...multivariateFeatures,
  };
}
