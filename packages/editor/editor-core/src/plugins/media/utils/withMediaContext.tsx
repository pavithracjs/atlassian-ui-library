import * as React from 'react';
import { Context as MediaContext } from '@atlaskit/media-core';
import { MediaProvider } from '../pm-plugins/main';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WithMediaContextProps {
  mediaProvider: Promise<MediaProvider>;
}

export interface WithMediaContextState {
  mediaContext?: MediaContext;
}

export interface WrappedComponentProps {
  mediaContext?: MediaContext;
}

function withMediaContext<P extends WrappedComponentProps>(
  WrapperComponent: React.ComponentType<P>,
) {
  return class WithMediaContext extends React.Component<
    Omit<P, 'mediaContext'> & WithMediaContextProps,
    WithMediaContextState
  > {
    mediaProvider?: MediaProvider;
    updatingMediaContext = false;
    state: WithMediaContextState = {};

    async componentDidMount() {
      await this.updateMediaContext();
    }

    componentDidUpdate() {
      return this.updateMediaContext();
    }

    async updateMediaContext(props: WithMediaContextProps = this.props) {
      if (this.updatingMediaContext || this.state.mediaContext) {
        return; // Prevent multiple update media context
      }
      this.updatingMediaContext = true;

      const { mediaContext } = this.state;

      const mediaProvider = await props.mediaProvider;
      if (mediaProvider && this.mediaProvider !== mediaProvider) {
        this.mediaProvider = mediaProvider;
        const newMediaContext = await this.mediaProvider.viewContext;
        if (!mediaContext && newMediaContext) {
          // Slightly different from original implementation :(, check with Alex and Vijay
          this.setState(() => ({
            mediaContext: newMediaContext,
          }));
        }
      }
    }

    render() {
      return (
        <WrapperComponent
          {...this.props as any} // Need to cast to any, because P doesn't contain media provider, suggestion accepted.
          mediaContext={this.state.mediaContext}
        />
      );
    }
  };
}

export default withMediaContext;
