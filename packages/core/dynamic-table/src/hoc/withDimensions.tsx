import * as React from 'react';

export interface State {
  refWidth: number;
  refHeight: number;
}

export interface WithDimensionsProps extends State {
  innerRef: (element: HTMLElement) => void;
}

export interface Props {
  isRanking: boolean;
}

// Compute height and width of wrapped component before ranking
export default function withDimensions<WrappedComponentProps extends object>(
  WrappedComponent: React.ComponentType<any>,
) {
  return class WithDimensions extends React.Component<
    Partial<WrappedComponentProps & Props>,
    State
  > {
    ref?: HTMLElement;

    state = {
      refWidth: 0,
      refHeight: 0,
    };

    innerRef = (ref: HTMLElement) => {
      if (ref !== null && !this.props.isRanking) {
        this.ref = ref;
      }
    };

    componentWillMount(): void {}

    componentWillReceiveProps(
      nextProps: Readonly<WrappedComponentProps & Props>,
    ) {
      const wasRanking = this.props.isRanking;
      const willRanking = nextProps.isRanking;

      if (willRanking && !wasRanking) {
        this.updateDimensions();
      }
    }

    updateDimensions = () => {
      if (!this.ref) {
        return;
      }

      const clientRect = this.ref.getBoundingClientRect();

      const { width } = clientRect;
      const { height } = clientRect;

      if (width !== this.state.refWidth || height !== this.state.refHeight) {
        this.setState({ refWidth: width, refHeight: height });
      }
    };

    render() {
      const { refWidth, refHeight } = this.state;

      return (
        <WrappedComponent
          refWidth={refWidth}
          refHeight={refHeight}
          innerRef={this.innerRef}
          {...this.props}
        />
      );
    }
  };
}
