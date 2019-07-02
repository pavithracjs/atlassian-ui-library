import * as React from 'react';

export interface Props {
  // optional only because I don't want the parent components that's using this to care about handling null queries,
  // both parents of this  ( ResourcedMentionList & editor-core/plugins/mentions) accept nullable query strings
  query?: String;
  createTeamLink: String;
  /** Spotlight will disappear after user types this many characters */
  queryLengthToHideSpotlight: number;
}

export interface State {
  showComponent: boolean;
}

export default class MentionSpotlight extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showComponent: true,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { query, queryLengthToHideSpotlight } = this.props;
    const { showComponent } = this.state;

    const queryChanged = query !== prevProps.query;

    console.log('componentDidUpdate', {
      query,
      queryLengthToHideSpotlight,
      showComponent,
      queryChanged,
    });

    // Do not try to hide the component if the component is already hidden
    // Do not try to hide the component if the query hasn't changed
    if (showComponent && queryChanged) {
      if (query && query.length >= queryLengthToHideSpotlight) {
        this.hideComponent();
      }
    }
  }

  hideComponent = () => {
    console.log('Hide component called');

    this.setState({
      showComponent: false,
    });
  };

  render() {
    const { showComponent } = this.state;
    console.log('render-showComponent', showComponent);

    if (!showComponent) return null;

    return (
      <>
        <div>I am SPOTLIGHT!</div>
        <div onClick={this.hideComponent}>CLOSE</div>
      </>
    );
  }
}
