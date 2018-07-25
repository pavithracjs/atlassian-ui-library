// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  /* Whether rendering is happening on the client or server */
  ssr?: boolean,
  /* Children to render in the React Portal. */
  children: Node,
  /* The z-index of the DOM container element. */
  zIndex: number,
};

type State = {
  container: ?HTMLElement,
};

const createContainer = (zIndex: number) => {
  const container = document.createElement('div');
  container.setAttribute('class', 'atlaskit-portal');
  container.setAttribute('style', `z-index: ${zIndex};`);
  return container;
};

const body = fn => document.body && fn(document.body);

const canUseDOM = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

// This is a generic component does two things:
// 1. Portals it's children using React.createPortal
// 2. Creates the DOM node container for the portal based on props

class Portal extends React.Component<Props, State> {
  static defaultProps = {
    zIndex: 0,
  };

  state = {
    container:
      !this.props.ssr && canUseDOM()
        ? createContainer(this.props.zIndex)
        : undefined,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { container } = this.state;
    const { zIndex } = this.props;
    if (container && prevProps.zIndex !== zIndex) {
      const newContainer = createContainer(zIndex);
      body(b => b.replaceChild(container, newContainer));
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ container: newContainer });
    } else if (!prevState.container && container) {
      // SSR path
      body(b => b.appendChild(container));
    }
  }
  componentDidMount() {
    const { container } = this.state;
    const { zIndex } = this.props;
    if (container) {
      body(b => b.appendChild(container));
    } else {
      // SSR path
      const newContainer = createContainer(zIndex);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ container: newContainer });
    }
  }
  componentWillUnmount() {
    const { container } = this.state;
    if (container) {
      body(b => b.removeChild(container));
    }
  }
  render() {
    const { container } = this.state;
    return container
      ? ReactDOM.createPortal(this.props.children, container)
      : this.props.children;
  }
}

export default Portal;
