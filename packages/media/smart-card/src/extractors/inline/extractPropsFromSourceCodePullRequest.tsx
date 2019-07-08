import * as React from 'react';
import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import PullRequestIcon from '@atlaskit/icon-object/glyph/pull-request/16';

import { extractInlineViewPropsFromObject } from './extractPropsFromObject';
import { buildName } from './extractPropsFromSourceCodeCommon';
import { BuildInlineProps } from './types';

type BuildInlinePropsSourceCodePullRequest = BuildInlineProps<
  InlineCardResolvedViewProps
>;

const buildInlineSourceCodePullRequestTag: BuildInlinePropsSourceCodePullRequest = json => {
  if (json['atlassian:state']) {
    return {
      lozenge: {
        appearance: 'success',
        text: json['atlassian:state'],
      },
    };
  }
  return {};
};

export const buildIcon: BuildInlinePropsSourceCodePullRequest = json => {
  const name = json.name;
  return { icon: <PullRequestIcon label={name} /> };
};

export const extractInlineViewPropsFromSourceCodePullRequest = (
  json: any,
): InlineCardResolvedViewProps => {
  const props = extractInlineViewPropsFromObject(json);
  return {
    ...props,
    ...buildIcon(json),
    ...buildName(props, json),
    ...buildInlineSourceCodePullRequestTag(json),
  };
};
