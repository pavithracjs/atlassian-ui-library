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
  cardState,
  handleAuthorize,
  handleFrameClick,
  isSelected,
  onResolve,
}) => {
  const { status, details } = cardState;
  switch (status) {
    case 'pending':
      return (
        <CardLinkView
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );
    case 'resolving':
      return (
        <InlineCardResolvingView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );
    case 'resolved':
      const props = extractInlinePropsFromJSONLD(
        (details && details.data) || {},
      );

      if (onResolve) {
        onResolve({
          url,
          title: props.title,
        });
      }

      return (
        <InlineCardResolvedView
          {...props}
          link={url}
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
      return (
        <CardLinkView
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );
  }
};
