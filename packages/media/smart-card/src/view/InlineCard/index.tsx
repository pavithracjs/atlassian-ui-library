import * as React from 'react';
import { FC } from 'react';
import {
  CardLinkView,
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  InlineCardForbiddenView,
  InlineCardUnauthorizedView,
} from '@atlaskit/media-ui';
import { InlineCardProps } from './types';
import { extractInlinePropsFromJSONLD } from '../../extractors/inline';
import { getCollapsedIcon } from '../../utils';

export const InlineCard: FC<InlineCardProps> = ({
  url,
  cardState: { status, details },
  handleAuthorize,
  handleFrameClick,
  isSelected,
}) => {
  switch (status) {
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
          {...extractInlinePropsFromJSONLD((details && details.data) || {})}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );
    case 'unauthorized':
      return (
        <InlineCardUnauthorizedView
          icon={getCollapsedIcon(details)}
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
        />
      );
    case 'forbidden':
      return (
        <InlineCardForbiddenView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
        />
      );
    case 'not_found':
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
};
