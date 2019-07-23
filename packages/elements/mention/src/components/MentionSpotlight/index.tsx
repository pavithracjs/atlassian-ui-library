import React from 'react';

import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import MentionSpotlightController from './MentionSpotlightController';

import {
  SpotlightTitle,
  SpotlightCloseTooltip,
  SpotlightDescription,
  SpotlightDescriptionLink,
} from '../../util/i18n';
import * as Styled from './styles';

export interface Props {
  createTeamLink: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
}

export interface State {
  isSpotlightClosed: boolean;
}

const ICON_URL =
  'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/2.svg';

export default class MentionSpotlight extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSpotlightClosed: false,
    };
  }
  componentDidMount() {
    MentionSpotlightController.registerRender();
  }

  onClick = () => {
    MentionSpotlightController.registerCreateLinkClick();
  };

  onCloseClick = () => {
    console.log('+++++++++++==========');
    this.setState({ isSpotlightClosed: true });
    this.props.onClose();
  };

  render() {
    const { createTeamLink } = this.props;
    const { isSpotlightClosed: isHighlightClosed } = this.state;

    if (isHighlightClosed) {
      return null;
    }

    return (
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
            <SpotlightCloseTooltip>
              {tooltip => (
                <Tooltip content={tooltip} position="bottom">
                  <Button
                    appearance="subtle"
                    iconBefore={<EditorCloseIcon label="Close" size="medium" />}
                    onClick={this.onCloseClick}
                    spacing="none"
                  />
                </Tooltip>
              )}
            </SpotlightCloseTooltip>
          </Styled.Actions>
        </Styled.Content>
      </Styled.Card>
    );
  }
}
