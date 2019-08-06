import React from 'react';
import { getCurrentUrlWithoutHash } from '@atlaskit/editor-common/src/utils/urls';
import {
  HeadingAnchor,
  CopyTextConsumer,
  HeadingLevels,
  WithCreateAnalyticsEvent,
} from '@atlaskit/editor-common';
import {
  HeadingComponents,
  HeadingAnchorWrapper,
} from '@atlaskit/editor-common/src/ui/heading-anchor';
import { FabricChannel } from '../../../../../elements/analytics-listeners/src';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { PLATFORM } from '../../analytics/events';

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
                  <WithCreateAnalyticsEvent
                    render={createAnalyticsEvent => (
                      <HeadingAnchor
                        onClick={() => {
                          if (createAnalyticsEvent) {
                            createAnalyticsEvent({
                              action: ACTION.CLICKED,
                              actionSubject: ACTION_SUBJECT.HEADING_ANCHOR_LINK,
                              attributes: { platform: PLATFORM.WEB },
                              eventType: EVENT_TYPE.UI,
                            }).fire(FabricChannel.editor);
                          }

                          return copyTextToClipboard(
                            `${getCurrentUrlWithoutHash()}#${encodeURIComponent(
                              headingId,
                            )}`,
                          );
                        }}
                      />
                    )}
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
