import * as React from 'react';
import { colors } from '@atlaskit/theme';
import { EventHandlers, mediaSingleClassName } from '@atlaskit/editor-common';
import styled from 'styled-components';

import { getEventHandler } from '../../utils';

const StyledAnchor = styled.a`
  color: ${colors.B400};

  & > .${mediaSingleClassName} {
    opacity: 1;
    transition: opacity 0.5s ease;
  }

  &:hover {
    & > .${mediaSingleClassName} {
      opacity: 0.8;
    }

    color: ${colors.B300};
    text-decoration: underline;
  }
`;

export default function Link(
  props: {
    children?: any;
    href: string;
    target?: string;
    eventHandlers?: EventHandlers;
  } & React.Props<any>,
) {
  const { href, target, eventHandlers } = props;

  const anchorProps: any = {
    href,
    target,
    title: href,
  };

  if (target === '_blank') {
    anchorProps.rel = 'noreferrer noopener';
  }

  const handler = getEventHandler(eventHandlers, 'link');

  return (
    <StyledAnchor
      onClick={e => {
        if (handler) {
          handler(e, href);
        }
      }}
      {...anchorProps}
    >
      {props.children}
    </StyledAnchor>
  );
}
