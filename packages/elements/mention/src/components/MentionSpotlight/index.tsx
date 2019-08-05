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
  createTeamLink?: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
  onCreateTeamLinkClick?: () => void;
  onViewed?: () => void;
}

export interface State {
  isSpotlightHidden: boolean;
}

export type Props = OwnProps & WithAnalyticsEventProps;

const ICON_URL =
  'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/2.svg';

export class MentionSpotlightInternal extends React.Component<Props, State> {
  // Wrap whole dialog so we can catch events, see preventClickOnCard
  elWrapper: RefObject<HTMLDivElement>;
  // Wrap the close button, so we can still manually invoke onClose()
  elCloseWrapper: RefObject<HTMLDivElement>;
  // Wrap the create team link, so we can still manually invoke the analytics
  elCreateTeamWrapper: RefObject<HTMLDivElement>;

  static defaultProps = {
    createTeamLink: '/people/search#createTeam',
  };

  constructor(props: Props) {
    super(props);
    this.elWrapper = React.createRef();
    this.elCloseWrapper = React.createRef();
    this.elCreateTeamWrapper = React.createRef();
    this.state = {
      isSpotlightHidden: false,
    };
  }

  componentDidMount() {
    const { onViewed } = this.props;
    this.addEventHandler();
    // Spotlight hiding logic was moved to Mount method because if Spotlight is re-rendered after updating the
    // counts at MentionSpotlightController, spotlight will appear for sometime and then disappear. As of the time
    // of writing this code, this was only happening in Fabric Editor ( See TEAMS-623 )
    if (!MentionSpotlightController.isSpotlightEnabled()) {
      this.setState({ isSpotlightHidden: true });
    } else {
      MentionSpotlightController.registerRender();
      if (onViewed) {
        onViewed();
      }
    }
  }

  componentWillUnmount() {
    this.removeEventHandler();
  }

  onCreateTeamLinkClick = () => {
    this.setState({ isSpotlightHidden: true });
    const { onCreateTeamLinkClick } = this.props;
    MentionSpotlightController.registerCreateLinkClick();
    if (onCreateTeamLinkClick) {
      onCreateTeamLinkClick();
    }
  };

  // This is to stop overly aggressive behaviour in tinyMCe editor where clicking anywhere in the spotlight would immediate close the entire
  // dropdown dialog. See TEAMS-611
  private preventClickOnCard = (event: any) => {
    // event is a MouseEvent

    // We stop the event from propagating, so we need to manually close
    const isClickOnCloseButton =
      this.elCloseWrapper.current &&
      this.elCloseWrapper.current.contains(event.target);
    if (isClickOnCloseButton) {
      this.onCloseClick();
    }

    // Manually perform on-click for the link, if the link was clicked.
    const isClickCreateTeamLink =
      this.elCreateTeamWrapper.current &&
      this.elCreateTeamWrapper.current.contains(event.target);
    if (isClickCreateTeamLink) {
      this.onCreateTeamLinkClick();
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
    this.setState({ isSpotlightHidden: true });
    this.props.onClose();
  };

  render() {
    const { createTeamLink } = this.props;
    const { isSpotlightHidden } = this.state;

    if (isSpotlightHidden) {
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
                    <div>
                      {description}
                      <span ref={this.elCreateTeamWrapper}>
                        <SpotlightDescriptionLink>
                          {linkText => (
                            <a href={createTeamLink} target="_blank">
                              {' '}
                              {linkText}
                            </a>
                            // on click fired by preventClickOnCard, not here
                          )}
                        </SpotlightDescriptionLink>
                      </span>
                    </div>
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
                        spacing="none"
                        // on click fired by preventClickOnCard, not here
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

  onCreateTeamLinkClick: (createEvent: CreateUIAnalyticsEventSignature) => {
    fireAnalyticsSpotlightMentionEvent(createEvent)(
      ComponentNames.SPOTLIGHT,
      Actions.CLICKED,
      ComponentNames.MENTION,
      'createTeamLink',
    );
  },

  onViewed: (createEvent: CreateUIAnalyticsEventSignature) => {
    fireAnalyticsSpotlightMentionEvent(createEvent)(
      ComponentNames.SPOTLIGHT,
      Actions.VIEWED,
      ComponentNames.MENTION,
      undefined,
      MentionSpotlightController.getSeenCount(),
    );
  },
})(MentionSpotlightInternal) as React.ComponentClass<OwnProps, State>;

const MentionSpotlight = MentionSpotlightWithAnalytics;
type MentionSpotlight = MentionSpotlightInternal;

export default MentionSpotlight;
