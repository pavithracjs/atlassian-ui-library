import * as React from 'react';
import styled from 'styled-components';
import Toggle from '@atlaskit/toggle';
import {
  LOCALSTORAGE_defaultMode,
  FULL_WIDTH_MODE,
  DEFAULT_MODE,
} from './example-constants';

const ToggleWrapper = styled.div`
  display: flex;
  min-width: 175px;
  align-items: center;
`;

interface Props {
  onFullWidthChange: (fullWidthMode: boolean) => void;
}

interface State {
  fullWidthMode: boolean;
}

export default class FullWidthToggle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const defaultMode = localStorage.getItem(LOCALSTORAGE_defaultMode);
    this.state = {
      fullWidthMode: defaultMode === FULL_WIDTH_MODE,
    };
  }

  componentDidMount() {
    this.props.onFullWidthChange(this.state.fullWidthMode);
  }

  private toggleFullWidthMode = () => {
    this.setState(
      prevState => ({ fullWidthMode: !prevState.fullWidthMode }),
      () => {
        localStorage.setItem(
          LOCALSTORAGE_defaultMode,
          this.state.fullWidthMode ? FULL_WIDTH_MODE : DEFAULT_MODE,
        );
        this.props.onFullWidthChange(this.state.fullWidthMode);
      },
    );
  };

  render() {
    return (
      <ToggleWrapper>
        <Toggle
          isDefaultChecked={this.state.fullWidthMode}
          onChange={this.toggleFullWidthMode}
          label="Full Width Mode"
        />
        <span>Full Width Mode</span>
      </ToggleWrapper>
    );
  }
}
