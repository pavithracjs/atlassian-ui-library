import React from 'react';
import { getCurrentUrlWithHash } from '@atlaskit/editor-common/src/utils/urls';
import {
  HeadingAnchor,
  CopyTextConsumer,
  HeadingLevels,
} from '@atlaskit/editor-common';
import {
  HeadingComponents,
  HeadingAnchorWrapper,
} from '@atlaskit/editor-common/src/ui/heading-anchor';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../analytics/enums';
import { PLATFORM } from '../../analytics/events';
import AnalyticsContext from '../../analytics/analyticsContext';

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
                  <AnalyticsContext.Consumer>
                    {({ fireAnalyticsEvent }) => (
                      <HeadingAnchor
                        onClick={() => {
                          fireAnalyticsEvent({
                            action: ACTION.CLICKED,
                            actionSubject: ACTION_SUBJECT.BUTTON,
                            actionSubjectId:
                              ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
                            eventType: EVENT_TYPE.UI,
                          });

                          return copyTextToClipboard(
                            getCurrentUrlWithHash(headingId),
                          );
                        }}
                      />
                    )}
                  </AnalyticsContext.Consumer>
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
