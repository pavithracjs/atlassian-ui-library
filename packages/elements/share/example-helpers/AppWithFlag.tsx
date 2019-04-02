import * as React from 'React';
import { colors } from '@atlaskit/theme';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import { Flag } from '../src/types';

type RenderChildren = (
  showFlags: (flags: Array<Flag>) => void,
) => React.ReactNode;

type Props = {
  children: RenderChildren;
};

type State = {
  flags: Array<Flag>;
};

export default class AppWithFlag extends React.PureComponent<Props, State> {
  state = {
    flags: [],
  };

  handleDismiss = () => {
    this.setState(prevState => ({
      flags: prevState.flags.slice(1),
    }));
  };

  addFlag = (flags: Array<Flag>) => {
    this.setState({ flags: [...this.state.flags, ...flags] });
  };

  render() {
    return (
      <>
        {this.props.children(this.addFlag)}
        <FlagGroup onDismissed={this.handleDismiss}>
          {this.state.flags.map((flag: Flag) => {
            return (
              <AutoDismissFlag
                appearance="normal"
                id={flag.id}
                icon={
                  <SuccessIcon
                    label="Success"
                    size="medium"
                    primaryColor={colors.G300}
                  />
                }
                key={flag.id}
                title={flag.localizedTitle}
              />
            );
          })}
        </FlagGroup>
      </>
    );
  }
}
