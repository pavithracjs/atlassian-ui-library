import React from 'react';
import { headingSizes } from '@atlaskit/editor-common/src/styles/shared/headings';
import { getCurrentUrlWithoutHash } from '@atlaskit/editor-common/src/utils/urls';
import { HeadingLevels } from '../../../../editor-core/src/plugins/block-type/types';
import { HeadingAnchor, CopyTextConsumer } from '@atlaskit/editor-common';
import { HeadingComponents } from '@atlaskit/editor-common/src/ui/heading-anchor';

function Heading(
  props: {
    level: HeadingLevels;
    headingId?: string;
    showAnchorLink?: boolean;
  } & React.Props<any>,
) {
  const { level, children, headingId, showAnchorLink } = props;
  const HX = `h${level}`;
  const HeadingTag = HeadingComponents[HX];

  return (
    <HeadingTag>
      <div className="heading-content">
        {showAnchorLink && (
          <div
            id={headingId}
            className="heading-anchor"
            style={{
              position: 'absolute',
              height: `${headingSizes[HX].lineHeight}em`,
            }}
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
          </div>
        )}
        {children}
      </div>
    </HeadingTag>
  );
}

export default Heading;
