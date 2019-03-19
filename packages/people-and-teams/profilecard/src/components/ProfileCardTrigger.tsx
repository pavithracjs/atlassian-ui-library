import React from 'react';
import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme';
import NodeResolver from 'react-node-resolver';

import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';
import Profilecard from './ProfileCard';
import withOuterListeners from './withOuterListeners';
import filterActions from '../internal/filterActions';

import { CardElevationWrapper, CardTriggerWrapper } from '../styled/Card';

const CardElevationWrapperWithOuter = withOuterListeners(CardElevationWrapper);

import {
  ProfileCardTriggerProps,
  ProfileCardTriggerState,
  ProfileCardAction,
  ProfilecardProps,
  ProfileCardClientData,
} from '../types';

class ProfilecardTrigger extends React.Component<
  ProfileCardTriggerProps,
  ProfileCardTriggerState
> {
  static defaultProps: Partial<ProfileCardTriggerProps> = {
    actions: [],
    trigger: 'hover',
    customElevation: 'e200',
  };

  _isMounted: boolean;
  wrapperRef: HTMLElement | null;
  targetRef: HTMLElement | null;

  showDelay: number = 500;
  hideDelay: number = 500;
  showTimer: any;
  hideTimer: any;

  constructor(props: ProfileCardTriggerProps) {
    super(props);
    this._isMounted = false;

    // In constrast to hover, click interactions should be instantaneous
    if (this.props.trigger === 'click') {
      this.showDelay = 0;
      this.hideDelay = 0;
    }
  }

  state: ProfileCardTriggerState = {
    visible: false,
    isLoading: false,
    hasError: false,
    error: null,
    data: null,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  // @FIXME do we need this for the TRIGGER component?
  componentDidUpdate(prevProps: ProfileCardTriggerProps) {
    const { userId, cloudId } = this.props;
    if (userId !== prevProps.userId || cloudId !== prevProps.cloudId) {
      this.clientFetchProfile();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  clientFetchProfile = () => {
    const { cloudId, userId } = this.props;

    this.setState({
      isLoading: true,
      hasError: false,
      data: null,
    });

    this.props.resourceClient
      .getProfile(cloudId, userId)
      .then(
        res => this.handleClientSuccess(res),
        err => this.handleClientError(err),
      )
      .catch(err => this.handleClientError(err));
  };

  handleClientSuccess(res: ProfileCardClientData) {
    if (!this._isMounted) {
      return;
    }

    this.setState({
      isLoading: false,
      hasError: false,
      data: res,
    });
  }

  handleClientError(err: any) {
    if (!this._isMounted) {
      return;
    }
    this.setState({
      isLoading: false,
      hasError: true,
      error: err,
    });
  }

  filterActions = (): ProfileCardAction[] =>
    filterActions(this.props.actions, this.state.data);

  hideProfilecard = () => {
    clearTimeout(this.showTimer);

    this.hideTimer = setTimeout(() => {
      this.setState({ visible: false });
    }, this.hideDelay);
  };

  showProfilecard = () => {
    if (!this.state.visible) {
      this.clientFetchProfile();
    }

    clearTimeout(this.hideTimer);

    this.showTimer = setTimeout(() => {
      this.setState({ visible: true });
    }, this.showDelay);
  };

  getContainerListeners = () => {
    const containerListeners = {} as any;

    if (this.props.trigger === 'hover') {
      containerListeners.onMouseEnter = this.showProfilecard;
      containerListeners.onMouseLeave = this.hideProfilecard;
    } else {
      containerListeners.onClick = this.showProfilecard;
    }

    return containerListeners;
  };

  getLayerListeners = () => {
    const layerListeners = {} as any;

    if (this.props.trigger !== 'hover') {
      layerListeners.handleClickOutside = this.hideProfilecard;
      layerListeners.handleEscapeKeydown = this.hideProfilecard;
    }

    return layerListeners;
  };

  renderProfileCard = () => {
    const newProps: ProfilecardProps = {
      clientFetchProfile: this.clientFetchProfile,
      analytics: this.props.analytics,
      ...this.state.data,
    };

    // @FIXME figure out better way to display error state
    // maybe putting it back into ProfileCard?!
    // put it back!!!
    if (this.state.hasError) {
      return (
        <CardElevationWrapper customElevation="none">
          <ErrorMessage
            errorType={this.state.error}
            reload={this.clientFetchProfile}
          />
        </CardElevationWrapper>
      );
    }

    return (
      <Profilecard
        {...newProps}
        actions={this.filterActions()}
        customElevation="none"
      />
    );
  };

  renderWithPopper = (element: React.ReactNode) => {
    const WrapperElement =
      this.props.trigger === 'hover'
        ? CardElevationWrapper
        : CardElevationWrapperWithOuter;

    return (
      <Popper referenceElement={this.targetRef} placement={this.props.position}>
        {({ ref, style }) => (
          <WrapperElement
            style={style}
            innerRef={ref}
            {...this.getContainerListeners()}
            {...this.getLayerListeners()}
            customElevation={this.props.customElevation}
          >
            {element}
          </WrapperElement>
        )}
      </Popper>
    );
  };

  renderLoading = () =>
    this.state.visible && this.state.isLoading && this.targetRef
      ? this.renderWithPopper(<LoadingState />)
      : null;

  renderProfileCardLoaded = () =>
    this.state.visible && !this.state.isLoading && this.targetRef
      ? this.renderWithPopper(this.renderProfileCard())
      : null;

  renderWithTrigger = () => (
    <>
      <CardTriggerWrapper
        {...this.getContainerListeners()}
        ref={wrapperRef => {
          this.wrapperRef = wrapperRef;
        }}
      >
        <NodeResolver
          innerRef={targetRef => {
            this.targetRef = targetRef;
          }}
        >
          {this.props.children}
        </NodeResolver>
      </CardTriggerWrapper>
      <Portal zIndex={layers.tooltip()}>
        {this.renderLoading()}
        {this.renderProfileCardLoaded()}
      </Portal>
    </>
  );

  render() {
    if (this.props.children) {
      return this.renderWithTrigger();
    } else {
      console.error('ProfileCardTrigger must have props.children');
      return null;
    }
  }
}

export default ProfilecardTrigger;
