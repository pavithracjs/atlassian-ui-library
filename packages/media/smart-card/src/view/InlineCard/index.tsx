import * as React from 'react';
import {
  CardLinkView,
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  InlineCardForbiddenView,
  InlineCardUnauthorizedView,
} from '@atlaskit/media-ui';
import { ObjectState } from '../../client';
import { extractInlinePropsFromJSONLD } from '../../extractors/inline';
import { getCollapsedIcon } from '../../utils';

export function renderInlineCard(
  url: string,
  state: ObjectState,
  handleAuthorise: (() => void) | undefined,
  handleFrameClick: () => void,
  isSelected?: boolean,
): React.ReactNode {
  switch (state.status) {
    case 'pending':
      return <CardLinkView link={url} isSelected={isSelected} />;

    case 'resolving':
      return (
        <InlineCardResolvingView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );

    case 'resolved':
      return (
        <InlineCardResolvedView
          {...extractInlinePropsFromJSONLD(state.data || {})}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );

    case 'unauthorized':
      return (
        <InlineCardUnauthorizedView
          icon={getCollapsedIcon(state)}
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorise}
        />
      );

    case 'forbidden':
      return (
        <InlineCardForbiddenView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorise}
        />
      );

    case 'not-found':
      return (
        <InlineCardErroredView
          url={url}
          isSelected={isSelected}
          message="We couldn't find this link"
          onClick={handleFrameClick}
        />
      );

    case 'errored':
      return <CardLinkView link={url} isSelected={isSelected} />;
  }
}
