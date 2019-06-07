import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractInlineViewPropsFromObject } from './extractPropsFromObject';
import { buildName } from './extractPropsFromSourceCodeCommon';

export const extractInlineViewPropsFromSourceCodeRepository = (
  json: any,
): InlineCardResolvedViewProps => {
  const props = extractInlineViewPropsFromObject(json);
  return {
    ...props,
    ...buildName({ ...props, title: '(branch)' }, json, json.name || ''),
  };
};
