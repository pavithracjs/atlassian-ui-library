import * as React from 'react';
import {
  CardLinkView,
  BlockCardResolvingView,
  BlockCardErroredView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
} from '@atlaskit/media-ui';

import { extractBlockPropsFromJSONLD } from '../../extractors/block';
import { getCollapsedIcon } from '../../utils';
import { ObjectState } from '../../client';

export function renderBlockCard(
  url: string,
  state: ObjectState,
  handleAuthorise: (() => void) | undefined,
  handleErrorRetry: () => void,
  handleFrameClick: () => void,
  isSelected?: boolean,
): React.ReactNode {
  switch (state.status) {
    case 'pending':
      return <CardLinkView link={url} isSelected={isSelected} />;

    case 'resolving':
      return (
        <BlockCardResolvingView
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );

    case 'resolved':
      return (
        <BlockCardResolvedView
          {...extractBlockPropsFromJSONLD(state.data || {})}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );

    case 'unauthorized':
      return (
        <BlockCardUnauthorisedView
          icon={getCollapsedIcon(state)}
          isSelected={isSelected}
          url={url}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorise}
        />
      );

    case 'forbidden':
      return (
        <BlockCardForbiddenView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorise}
        />
      );

    case 'not-found':
      return (
        <BlockCardErroredView
          url={url}
          isSelected={isSelected}
          message="We couldn't find this link"
          onClick={handleFrameClick}
        />
      );

    case 'errored':
      return (
        <BlockCardErroredView
          url={url}
          isSelected={isSelected}
          message="We couldn't load this link"
          onClick={handleFrameClick}
          onRetry={handleErrorRetry}
        />
      );
  }
}
