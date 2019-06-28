import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PureComponent } from 'react';
import * as PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';
import { Popup } from '@atlaskit/editor-common';
import Button, { ButtonGroup } from '@atlaskit/button';

import { withAnalytics } from '../../analytics';
import ToolbarButton from '../ToolbarButton';
import withOuterListeners from '../with-outer-listeners';

import {
  Wrapper,
  ButtonContent,
  ConfirmationPopup,
  ConfirmationText,
  ConfirmationHeader,
  ConfirmationImg,
} from './styles';
import {
  analyticsEventKey,
  AnalyticsDispatch,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../plugins/analytics';
import { createDispatch } from '../../event-dispatcher';
import { openFeedbackDialog } from '../../plugins/feedback-dialog';
import { FeedbackInfo } from '../../types';

const PopupWithOutsideListeners: any = withOuterListeners(Popup);
const POPUP_HEIGHT = 388;
const POPUP_WIDTH = 280;

const EDITOR_IMAGE_URL =
  'https://confluence.atlassian.com/download/attachments/945114421/editorillustration@2x.png?api=v2';

export type EditorProduct =
  | 'bitbucket'
  | 'jira'
  | 'confluence'
  | 'stride'
  | undefined;

export interface Props {
  /** DEPRECATED - moved to EditorProps.feedbackInfo.packageVersion. Feedback modal is now a part of Editor. */
  packageVersion?: string;
  /** DEPRECATED - moved to EditorProps.feedbackInfo.packageName. Feedback modal is now a part of Editor. */
  packageName?: string;
  product?: EditorProduct;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  /** DEPRECATED - moved to EditorProps.feedbackInfo.labels. Feedback modal is now a part of Editor. */
  labels?: string[];
}

export interface State {
  jiraIssueCollectorScriptLoading: boolean;
  showOptOutOption?: boolean;
  target?: HTMLElement;
}

declare global {
  interface Window {
    jQuery: any;
    ATL_JQ_PAGE_PROPS: any;
  }
}

export default class ToolbarFeedback extends PureComponent<Props, State> {
  static contextTypes = {
    editorActions: PropTypes.object.isRequired,
  };

  state: State = {
    jiraIssueCollectorScriptLoading: false,
    showOptOutOption: false,
  };

  private handleRef = (ref: ToolbarButton | null) => {
    if (ref) {
      this.setState({
        target: ReactDOM.findDOMNode(ref || null) as HTMLElement,
      });
    }
  };

  showJiraCollectorDialogCallback?: () => void;

  private handleSpinnerComplete() {}

  private getFeedbackInfo(): FeedbackInfo {
    return Object.entries(
      (({ product, packageVersion, packageName, labels }: FeedbackInfo) => ({
        product,
        packageVersion,
        packageName,
        labels,
      }))(this.props),
    )
      .filter(([_name, value]) => value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }

  render() {
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
    } = this.props;
    const iconBefore = this.state.jiraIssueCollectorScriptLoading ? (
      <Spinner isCompleting={false} onComplete={this.handleSpinnerComplete} />
    ) : (
      undefined
    );

    // JIRA issue collector script is using jQuery internally
    return this.hasJquery() ? (
      <Wrapper>
        <ToolbarButton
          ref={this.handleRef}
          iconBefore={iconBefore}
          onClick={this.collectFeedback}
          selected={false}
          spacing="compact"
        >
          <ButtonContent>Feedback</ButtonContent>
        </ToolbarButton>
        {this.state.showOptOutOption && (
          <PopupWithOutsideListeners
            target={this.state.target}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            fitHeight={POPUP_HEIGHT}
            fitWidth={POPUP_WIDTH}
            handleClickOutside={this.toggleShowOptOutOption}
            handleEscapeKeydown={this.toggleShowOptOutOption}
          >
            <ConfirmationPopup>
              <ConfirmationHeader>
                <ConfirmationImg src={EDITOR_IMAGE_URL} />
              </ConfirmationHeader>
              <ConfirmationText>
                <div>
                  We are rolling out a new editing experience across Atlassian
                  products. Help us improve by providing feedback.
                </div>
                <div>
                  You can opt-out for now by turning off the "Atlassian Editor"
                  feature on the Labs page in Bitbucket settings.
                </div>
                <ButtonGroup>
                  <Button appearance="primary" onClick={this.openFeedbackPopup}>
                    Give feedback
                  </Button>
                  <Button appearance="default" onClick={this.openLearnMorePage}>
                    Learn more
                  </Button>
                </ButtonGroup>
              </ConfirmationText>
            </ConfirmationPopup>
          </PopupWithOutsideListeners>
        )}
      </Wrapper>
    ) : null;
  }

  private collectFeedback = (): void => {
    if (this.props.product === 'bitbucket') {
      this.setState({ showOptOutOption: true });
    } else {
      this.openFeedbackPopup();
    }
  };

  private toggleShowOptOutOption = (): void => {
    this.setState({ showOptOutOption: !this.state.showOptOutOption });
  };

  private openJiraIssueCollector = async () => {
    this.setState({
      jiraIssueCollectorScriptLoading: true,
      showOptOutOption: false,
    });

    await openFeedbackDialog(this.getFeedbackInfo());

    this.setState({ jiraIssueCollectorScriptLoading: false });
  };

  private openFeedbackPopup = withAnalytics(
    'atlassian.editor.feedback.button',
    (): boolean => {
      const dispatch: AnalyticsDispatch = createDispatch(
        this.context.editorActions.eventDispatcher,
      );
      dispatch(analyticsEventKey, {
        payload: {
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_FEEDBACK,
          eventType: EVENT_TYPE.UI,
        },
      });
      this.openJiraIssueCollector();

      return true;
    },
  );

  private openLearnMorePage = () => {
    window.open('https://confluence.atlassian.com/x/NU1VO', '_blank');
    this.toggleShowOptOutOption();
  };

  private hasJquery = (): boolean => {
    return typeof window.jQuery !== 'undefined';
  };
}
