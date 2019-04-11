import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { colors, gridSize } from '@atlaskit/theme';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import { messages } from '../../messages';

interface Props {
  onClick: () => void;
}

// need to add a container around the button so that it lines up with the
// underline of the search input box.
const FeedbackButtonContainer = styled.div`
  margin-top: ${gridSize() * 0.5}px;
`;

const LighterSubtleButton = styled(Button)`
  & {
    color: ${colors.N90} !important;
  }
`;

export default class FeedbackButton extends React.Component<Props> {
  render() {
    return (
      <FeedbackButtonContainer>
        <LighterSubtleButton
          appearance="subtle"
          iconBefore={<FeedbackIcon label="Give feedback" />}
          onClick={this.props.onClick}
        >
          <FormattedMessage {...messages.give_feedback} />
        </LighterSubtleButton>
      </FeedbackButtonContainer>
    );
  }
}
