import * as React from 'react';
import {
  DropzoneReact as DropzoneReactType,
  DropzoneReactProps,
} from './dropzoneReact';

interface DropzoneReactLoaderState {
  DropzoneReact?: typeof DropzoneReactType;
}

export default class DropzoneReactLoader extends React.PureComponent<
  DropzoneReactProps,
  DropzoneReactLoaderState
> {
  static DropzoneReact?: typeof DropzoneReactType;

  state = { DropzoneReact: DropzoneReactLoader.DropzoneReact };

  async componentWillMount() {
    if (!this.state.DropzoneReact) {
      const {
        DropzoneReact,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-dropzone" */ './dropzoneReact');
      DropzoneReactLoader.DropzoneReact = DropzoneReact;
      this.setState({ DropzoneReact });
    }
  }

  render() {
    if (!this.state.DropzoneReact) {
      return null;
    }

    return <this.state.DropzoneReact {...this.props} />;
  }
}
