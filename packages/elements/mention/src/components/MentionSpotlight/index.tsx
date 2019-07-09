import * as React from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import * as Styled from './styled';

import Button from '@atlaskit/button';
import CloseIcon from '@atlaskit/icon/glyph/cross';

import Tooltip from '@atlaskit/tooltip';

export interface Props {
  /** Decides whether component should be rendered or not. This logic could have been implemented by passing
   * `query` as a prop and checking whether it changed. But `editor-core` does not update props, it always
   * remounts a new instance. So that approach will not work in `editor-core`. So calculating show/hide state
   * should be done external to this component (use function `shouldShowMentionSpotlight` at the end of this file)
   */
  showComponent: boolean;
  createTeamLink: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
}

export default class MentionSpotlight extends React.Component<Props, {}> {
  render() {
    const { showComponent, onClose, createTeamLink } = this.props;

    if (!showComponent) {
      return null;
    }

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

            <Styled.Actions>
              <Tooltip content="Close" position="bottom">
                <Button
                  appearance="subtle"
                  iconBefore={<CloseIcon label="Close Modal" size="medium" />}
                  onClick={onClose}
                />
              </Tooltip>
            </Styled.Actions>
          </Styled.Heading>
          <Styled.Body>
            <p>
              If you don't have any teams,{' '}
              <BrowserRouter>
                <Link to={createTeamLink}>start a team </Link>
              </BrowserRouter>{' '}
              with the group of people you work daily
            </p>
          </Styled.Body>
        </Styled.Section>
      </Styled.Card>
    );
  }
}

export const shouldShowMentionSpotlight = (
  componentIsShownNow: boolean,
  queryLengthToHideSpotlight: number,
  queryChanged: boolean,
  query?: String,
) => {
  // Do not try to hide the component if the component is already hidden
  // Do not try to hide the component if the query hasn't changed
  if (componentIsShownNow && queryChanged) {
    if (query && query.length >= queryLengthToHideSpotlight) {
      return false;
    }
  }

  // keep the component visibility as it is
  return componentIsShownNow;
};
