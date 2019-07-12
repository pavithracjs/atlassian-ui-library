import * as React from 'react';
import * as Styled from './styles';

import Button from '@atlaskit/button';
import CloseIcon from '@atlaskit/icon/glyph/cross';

import Tooltip from '@atlaskit/tooltip';
import { SpotlightTitle, SpotlightCloseTooltip } from '../../util/i18n';

export interface Props {
  createTeamLink: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
}

export default class MentionSpotlight extends React.Component<Props, {}> {
  render() {
    const { onClose, createTeamLink } = this.props;

    return (
      <Styled.Card>
        <Styled.Content>
          <Styled.Aside>
            <img src={Styled.iconUrl} height={32} />
          </Styled.Aside>
          <Styled.Section>
            <Styled.Heading>
              <Styled.Title>
                <strong>
                  <SpotlightTitle />
                </strong>
              </Styled.Title>
            </Styled.Heading>
            <Styled.Body>
              <p>
                If you don't have any teams,
                <a href={createTeamLink} target="_blank">
                  {' '}
                  start a team{' '}
                </a>
                with the group of people you work with daily.
              </p>
            </Styled.Body>
          </Styled.Section>
          <Styled.Actions>
            <SpotlightCloseTooltip>
              {tooltip => (
                <Tooltip content={tooltip} position="bottom">
                  <Button
                    appearance="subtle"
                    iconBefore={<CloseIcon label="Close Modal" size="small" />}
                    onClick={onClose}
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
