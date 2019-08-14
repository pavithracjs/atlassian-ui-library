import * as React from 'react';
import { FC } from 'react';
import {
  CardLinkView,
  BlockCardResolvingView,
  BlockCardErroredView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
} from '@atlaskit/media-ui';
import { BlockCardProps } from './types';
import { extractBlockPropsFromJSONLD } from '../../extractors/block';
import { getCollapsedIcon } from '../../utils';

export const BlockCard: FC<BlockCardProps> = ({
  url,
  cardState: { status, details },
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  isSelected,
  onResolve,
}) => {
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
        <BlockCardResolvingView
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );
    case 'resolved':
      const props = extractBlockPropsFromJSONLD(
        (details && details.data) || {},
      );

      if (onResolve) {
        onResolve({ title: props.title && props.title.text, url });
      }

      return (
        <BlockCardResolvedView
          {...props}
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );
    case 'unauthorized':
      return (
        <BlockCardUnauthorisedView
          icon={getCollapsedIcon(details)}
          isSelected={isSelected}
          url={url}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
        />
      );
    case 'forbidden':
      return (
        <BlockCardForbiddenView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
        />
      );
    case 'not_found':
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
};
