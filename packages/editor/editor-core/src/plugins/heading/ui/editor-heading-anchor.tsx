import React from 'react';
import { IntlProvider } from 'react-intl';
import { HeadingAnchor } from '@atlaskit/editor-common';
import {
  DispatchAnalyticsEvent,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../analytics';

class EditorHeadingAnchor extends React.PureComponent<
  {
    onClick: () => Promise<void>;
    locale: string;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  } & React.Props<any>
> {
  render() {
    return (
      <IntlProvider locale={this.props.locale}>
        <HeadingAnchor
          onClick={() => {
            if (this.props.dispatchAnalyticsEvent) {
              this.props.dispatchAnalyticsEvent({
                action: ACTION.CLICKED,
                actionSubject: ACTION_SUBJECT.BUTTON,
                actionSubjectId: ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
                eventType: EVENT_TYPE.UI,
              });
            }
            return this.props.onClick();
          }}
        />
      </IntlProvider>
    );
  }
}

export default EditorHeadingAnchor;
