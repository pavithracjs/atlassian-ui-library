import * as React from 'react';
import * as debounce from 'lodash.debounce';
import TeamMentionResource, {
  TeamMentionResourceConfig,
} from '../src/api/TeamMentionResource';
import { MentionResourceConfig } from '../src/api/MentionResource';

export interface Props {
  children?: any;
  userMentionConfig: MentionResourceConfig;
  teamMentionConfig: TeamMentionResourceConfig;
}

export interface State {
  resourceProvider: TeamMentionResource | null;
  teamMentionConfig: TeamMentionResourceConfig;
  userMentionConfig: MentionResourceConfig;
}

export default class ConfigurableTeamMentionPicker extends React.Component<
  Props,
  State
> {
  state: State = {
    resourceProvider: new TeamMentionResource(
      this.props.userMentionConfig,
      this.props.teamMentionConfig,
    ),
    teamMentionConfig: this.props.teamMentionConfig,
    userMentionConfig: this.props.userMentionConfig,
  };

  componentDidMount() {
    this.refreshMentions();
  }

  refreshMentions() {
    const resourceProvider = new TeamMentionResource(
      this.state.userMentionConfig,
      this.state.teamMentionConfig,
    );
    this.setState({
      resourceProvider,
    });
  }

  componentDidUpdate(_: Readonly<Props>, prevState: Readonly<State>): void {
    const { teamMentionConfig, userMentionConfig } = this.state;

    if (
      teamMentionConfig !== prevState.teamMentionConfig ||
      userMentionConfig !== prevState.userMentionConfig
    ) {
      this.refreshMentions();
    }
  }

  configTextAreaChange = debounce(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      let config;

      try {
        config = JSON.parse(event.target.value);
        const stateName = event.target.name;
        // @ts-ignore
        this.setState({
          [stateName]: config,
        });
      } catch (err) {
        // do not need to catch this error
      }
    },
    200,
  );

  render() {
    const { userMentionConfig, teamMentionConfig } = this.props;
    const { resourceProvider } = this.state;

    return (
      <div style={{ padding: '10px' }}>
        {React.cloneElement(this.props.children, { resourceProvider })}
        <p>
          <label htmlFor="mention-urls">MentionResource config</label>
        </p>

        <div>
          <h3>Default mention config</h3>
          <textarea
            id="mention-urls"
            rows={15}
            style={{ width: '400px' }}
            name="userMentionConfig"
            onChange={this.configTextAreaChange}
            defaultValue={JSON.stringify(userMentionConfig, null, 2)}
          />
        </div>

        <div>
          <h3>Team service config</h3>
          <textarea
            id="mention-urls-team"
            name="teamMentionConfig"
            rows={15}
            style={{ width: '400px' }}
            onChange={this.configTextAreaChange}
            defaultValue={JSON.stringify(teamMentionConfig, null, 2)}
          />
        </div>
      </div>
    );
  }
}
