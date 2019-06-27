import { Feature, FeatureMap } from '../types';

const propToFeature = (props: any, key: string) => {
  if (key === Feature.xflow) {
    return typeof props.triggerXFlow === 'function';
  }
  return Boolean(props[key]);
};

export default function mapPropsToFeatures(props: any): FeatureMap {
  return Object.keys(Feature).reduce(
    (acc, key) => ({
      ...acc,
      [key]: propToFeature(props, key),
    }),
    {},
  ) as FeatureMap;
}
