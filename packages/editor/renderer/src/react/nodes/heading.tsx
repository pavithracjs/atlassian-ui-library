import React from 'react';
import { getCurrentUrlWithoutHash } from '@atlaskit/editor-common/src/utils/urls';
import { HeadingLevels } from '../../../../editor-core/src/plugins/block-type/types';
import { HeadingAnchor, CopyTextConsumer } from '@atlaskit/editor-common';
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
      <HeadingAnchorWrapper
        anchorId="headingId"
        visible={!!props.showAnchorLink}
      >
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
      </HeadingAnchorWrapper>
      {props.children}
    </HeadingTag>
  );
}

export default Heading;
