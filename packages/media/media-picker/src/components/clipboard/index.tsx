import * as React from 'react';
import { Clipboard as ClipboardType, ClipboardProps } from './component';

type State = {
  Clipboard?: typeof ClipboardType;
};

export class ClipboardLoader extends React.PureComponent<
  ClipboardProps,
  State
> {
  static displayName = 'AsyncClipboard';
  static Clipboard?: typeof ClipboardType;

  state = {
    Clipboard: ClipboardLoader.Clipboard,
  };

  componentWillMount() {
    if (!this.state.Clipboard) {
      import(/* webpackChunkName:"@atlaskit-internal_Clipboard" */ './component').then(
        module => {
          ClipboardLoader.Clipboard = module.Clipboard;
          this.setState({ Clipboard: module.Clipboard });
        },
      );
    }
  }

  render() {
    if (!this.state.Clipboard) {
      return null;
    }

    return <this.state.Clipboard {...this.props} />;
  }
}
