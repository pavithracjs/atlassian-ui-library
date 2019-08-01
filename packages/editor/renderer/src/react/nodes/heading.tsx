import React from 'react';
import { getCurrentUrlWithoutHash } from '@atlaskit/editor-common/src/utils/urls';
import {
  HeadingAnchor,
  CopyTextConsumer,
  HeadingLevels,
} from '@atlaskit/editor-common';
import {
  HeadingComponents,
  HeadingAnchorWrapper,
} from '@atlaskit/editor-common/src/ui/heading-anchor';

function Heading(
  props: {
    level: HeadingLevels;
    headingId?: string;
    showAnchorLink?: boolean;
  } & React.Props<any>,
) {
  const { headingId } = props;
  const HeadingTag = HeadingComponents[`h${props.level}`];

  return (
    <HeadingTag>
      <HeadingAnchorWrapper anchorId={headingId}>
        {!!props.showAnchorLink && (
          <CopyTextConsumer>
            {({ copyTextToClipboard }) => {
              return (
                headingId && (
                  <HeadingAnchor
                    onClick={() => {
                      return copyTextToClipboard(
                        `${getCurrentUrlWithoutHash()}#${encodeURIComponent(
                          headingId,
                        )}`,
                      );
                    }}
                  />
                )
              );
            }}
          </CopyTextConsumer>
        )}
      </HeadingAnchorWrapper>
      {props.children}
    </HeadingTag>
  );
}

export default Heading;
