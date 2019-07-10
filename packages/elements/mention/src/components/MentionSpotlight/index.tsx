import * as React from 'react';
import * as Styled from './styled';

import Button from '@atlaskit/button';
import CloseIcon from '@atlaskit/icon/glyph/cross';

import Tooltip from '@atlaskit/tooltip';

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
        <Styled.Aside>
          <img src={Styled.iconUrl} height={32} />
        </Styled.Aside>
        <Styled.Section>
          <Styled.Heading>
            <Styled.Title>
              <strong>You can now mention teams! </strong>
            </Styled.Title>
          </Styled.Heading>
          <Styled.Body>
            <p>
              If you don't have any teams,{' '}
              <a href={createTeamLink} target="_blank">
                start a team{' '}
              </a>
              with the group of people you work with daily.
            </p>
          </Styled.Body>
        </Styled.Section>
        <Styled.Actions>
          <Tooltip content="Close" position="bottom">
            <Button
              appearance="subtle"
              iconBefore={<CloseIcon label="Close Modal" size="small" />}
              onClick={onClose}
            />
          </Tooltip>
        </Styled.Actions>
      </Styled.Card>
    );
  }
}
