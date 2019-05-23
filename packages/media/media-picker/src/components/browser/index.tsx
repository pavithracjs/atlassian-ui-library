import * as React from 'react';
import { Browser as BrowserType, BrowserProps } from './browser';

type State = {
  Browser?: typeof BrowserType;
};

export class BrowserLoader extends React.PureComponent<BrowserProps, State> {
  static displayName = 'AsyncBrowser';
  static Browser?: typeof BrowserType;

  state = {
    Browser: BrowserLoader.Browser,
  };

  componentWillMount() {
    if (!this.state.Browser) {
      import(/* webpackChunkName:"@atlaskit-internal_Browser" */ './browser').then(
        module => {
          BrowserLoader.Browser = module.Browser;
          this.setState({ Browser: module.Browser });
        },
      );
    }
  }

  render() {
    if (!this.state.Browser) {
      return null;
    }

    return <this.state.Browser {...this.props} />;
  }
}
