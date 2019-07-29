import React, { RefObject } from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventProps,
  CreateUIAnalyticsEventSignature,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import MentionSpotlightController from './MentionSpotlightController';

import {
  fireAnalyticsSpotlightMentionEvent,
  ComponentNames,
  Actions,
} from '../../util/analytics';

import {
  SpotlightTitle,
  SpotlightCloseTooltip,
  SpotlightDescription,
  SpotlightDescriptionLink,
} from '../../util/i18n';
import * as Styled from './styles';

export interface OwnProps {
  createTeamLink: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
}

export interface State {
  isSpotlightClosed: boolean;
}

export type Props = OwnProps & WithAnalyticsEventProps;

const ICON_URL =
  'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/2.svg';

export class MentionSpotlightInternal extends React.Component<Props, State> {
  // Wrap whole dialog so we can catch events, see preventClickOnCard
  elWrapper: RefObject<HTMLDivElement>;
  // Wrap the close button, so we can still manually invoke onClose()
  elCloseWrapper: RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.elWrapper = React.createRef();
    this.elCloseWrapper = React.createRef();
    this.state = {
      isSpotlightClosed: false,
    };
  }

  componentDidMount() {
    this.addEventHandler();
    MentionSpotlightController.registerRender();
  }

  componentWillUnmount() {
    this.removeEventHandler();
  }

  onClick = () => {
    MentionSpotlightController.registerCreateLinkClick();
  };

  // This is to stop overly aggressive behaviour where clicking anywhere in the spotlight would immediate close the entire
  // dropdown dialog
  private preventClickOnCard = (event: any) => {
    // We stop the event from propagating, so we need to manually close
    const isClickOnCloseButton =
      this.elCloseWrapper.current &&
      this.elCloseWrapper.current.contains(event.target);
    if (isClickOnCloseButton) {
      this.onCloseClick();
    }

    // Allow default so the link to create team still works, but prevent the rest
    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  private addEventHandler(): void {
    this.elWrapper.current &&
      this.elWrapper.current.addEventListener('click', this.preventClickOnCard);
  }

  private removeEventHandler(): void {
    this.elWrapper.current &&
      this.elWrapper.current.removeEventListener(
        'click',
        this.preventClickOnCard,
      );
  }

  onCloseClick = () => {
    this.setState({ isSpotlightClosed: true });
    this.props.onClose();
  };

  render() {
    const { createTeamLink } = this.props;
    const { isSpotlightClosed } = this.state;

    if (isSpotlightClosed) {
      return null;
    }

    return (
      <div ref={this.elWrapper}>
        <Styled.Card>
          <Styled.Content>
            <Styled.Aside>
              <img src={ICON_URL} height={32} />
            </Styled.Aside>
            <Styled.Section>
              <Styled.Heading>
                <Styled.Title>
                  <SpotlightTitle />
                </Styled.Title>
              </Styled.Heading>
              <Styled.Body>
                <SpotlightDescription>
                  {description => (
                    <p>
                      {description}
                      <SpotlightDescriptionLink>
                        {linkText => (
                          <a
                            href={createTeamLink}
                            target="_blank"
                            onClick={this.onClick}
                          >
                            {' '}
                            {linkText}
                          </a>
                        )}
                      </SpotlightDescriptionLink>
                    </p>
                  )}
                </SpotlightDescription>
              </Styled.Body>
            </Styled.Section>
            <Styled.Actions>
              <div ref={this.elCloseWrapper}>
                <SpotlightCloseTooltip>
                  {tooltip => (
                    <Tooltip content={tooltip} position="bottom">
                      <Button
                        appearance="subtle"
                        iconBefore={
                          <EditorCloseIcon label="Close" size="medium" />
                        }
                        onClick={this.onCloseClick}
                        spacing="none"
                      />
                    </Tooltip>
                  )}
                </SpotlightCloseTooltip>
              </div>
            </Styled.Actions>
          </Styled.Content>
        </Styled.Card>
      </div>
    );
  }
}

const MentionSpotlightWithAnalytics = withAnalyticsEvents<OwnProps>({
  onClose: (createEvent: CreateUIAnalyticsEventSignature) => {
    fireAnalyticsSpotlightMentionEvent(createEvent)(
      ComponentNames.SPOTLIGHT,
      Actions.CLOSED,
      ComponentNames.MENTION,
      'closeButton',
    );
  },
})(MentionSpotlightInternal) as React.ComponentClass<OwnProps>;

const MentionSpotlight = MentionSpotlightWithAnalytics;
type MentionSpotlight = MentionSpotlightInternal;

export default MentionSpotlight;
