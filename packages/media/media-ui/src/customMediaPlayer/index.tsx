import * as React from 'react';
import { Component } from 'react';
import PlayIcon from '@atlaskit/icon/glyph/vid-play';
import PauseIcon from '@atlaskit/icon/glyph/vid-pause';
import FullScreenIconOn from '@atlaskit/icon/glyph/vid-full-screen-on';
import FullScreenIconOff from '@atlaskit/icon/glyph/vid-full-screen-off';
import SoundIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import HDIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import MediaButton from '../MediaButton';
import Spinner from '@atlaskit/spinner';
import MediaPlayer, {
  SetVolumeFunction,
  NavigateFunction,
  VideoState,
  VideoActions,
} from 'react-video-renderer';
import { colors } from '@atlaskit/theme';
import { TimeRange } from './timeRange';
import {
  CurrentTime,
  VideoWrapper,
  CustomVideoWrapper,
  TimebarWrapper,
  VolumeWrapper,
  TimeWrapper,
  LeftControls,
  RightControls,
  ControlsWrapper,
  VolumeToggleWrapper,
  MutedIndicator,
  SpinnerWrapper,
  VolumeTimeRangeWrapper,
} from './styled';
import { formatDuration } from '../formatDuration';
import { hideControlsClassName } from '../classNames';
import { Shortcut, keyCodes } from '../shortcut';
import {
  toggleFullscreen,
  getFullscreenElement,
  vendorify,
} from './fullscreen';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../messages';
import simultaneousPlayManager, {
  SimultaneousPlaySubscription,
} from './simultaneousPlayManager';

export interface CustomMediaPlayerProps {
  readonly type: 'audio' | 'video';
  readonly src: string;
  readonly isHDActive?: boolean;
  readonly onHDToggleClick?: () => void;
  readonly isHDAvailable?: boolean;
  readonly showControls?: () => void;
  readonly isAutoPlay: boolean;
  readonly isShortcutEnabled?: boolean;
  readonly onCanPlay?: () => void;
  readonly onError?: () => void;
}

export interface CustomMediaPlayerState {
  isFullScreenEnabled: boolean;
}

export type ToggleButtonAction = () => void;

type CustomMediaPlayerPropsInternal = CustomMediaPlayerProps &
  InjectedIntlProps;

export type CustomMediaPlayerActions = {
  play: () => void;
  pause: () => void;
};

export class CustomMediaPlayer extends Component<
  CustomMediaPlayerPropsInternal,
  CustomMediaPlayerState
> {
  videoWrapperRef?: HTMLElement;
  private actions?: CustomMediaPlayerActions;
  private simultaneousPlay: SimultaneousPlaySubscription;

  state: CustomMediaPlayerState = {
    isFullScreenEnabled: false,
  };

  constructor(props: CustomMediaPlayerPropsInternal) {
    super(props);
    this.simultaneousPlay = simultaneousPlayManager.subscribe(this.pause);
  }

  componentDidMount() {
    document.addEventListener(
      vendorify('fullscreenchange', false),
      this.onFullScreenChange,
    );

    if (this.props.isAutoPlay) {
      this.simultaneousPlay.onPlay();
    }
  }

  componentWillUnmount() {
    document.removeEventListener(
      vendorify('fullscreenchange', false),
      this.onFullScreenChange,
    );
    this.simultaneousPlay.unsubscribe();
  }

  onFullScreenChange = () => {
    const { isFullScreenEnabled: currentFullScreenMode } = this.state;
    const isFullScreenEnabled = getFullscreenElement() === this.videoWrapperRef;

    if (currentFullScreenMode !== isFullScreenEnabled) {
      this.setState({
        isFullScreenEnabled,
      });
    }
    if (isFullScreenEnabled) {
      this.simultaneousPlay.onPlay();
    }
  };

  onTimeChange = (navigate: NavigateFunction) => (value: number) => {
    navigate(value);
  };

  onVolumeChange = (setVolume: SetVolumeFunction) => (value: number) =>
    setVolume(value);

  shortcutHandler = (toggleButtonAction: ToggleButtonAction) => () => {
    const { showControls } = this.props;

    // Will only play by shortcut if it was the last played.
    if (
      toggleButtonAction !== this.play ||
      this.simultaneousPlay.isLastPlayed()
    ) {
      toggleButtonAction();
    }

    if (showControls) {
      showControls();
    }
  };

  renderHDButton = () => {
    const { type, isHDAvailable, isHDActive, onHDToggleClick } = this.props;

    if (type === 'audio' || !isHDAvailable) {
      return;
    }
    const primaryColor = isHDActive ? colors.B200 : colors.DN400;
    const secondaryColor = isHDActive ? colors.white : colors.DN60;
    return (
      <MediaButton
        appearance={'toolbar' as any}
        onClick={onHDToggleClick}
        iconBefore={
          <HDIcon
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            label="hd"
          />
        }
      />
    );
  };

  renderVolume = ({ isMuted, volume }: VideoState, actions: VideoActions) => {
    return (
      <VolumeWrapper>
        <VolumeToggleWrapper isMuted={isMuted}>
          <MutedIndicator isMuted={isMuted} />
          <MediaButton
            appearance={'toolbar' as any}
            onClick={actions.toggleMute}
            iconBefore={<SoundIcon label="volume" />}
          />
        </VolumeToggleWrapper>
        <VolumeTimeRangeWrapper>
          <TimeRange
            onChange={this.onVolumeChange(actions.setVolume)}
            duration={1}
            currentTime={volume}
            bufferedTime={volume}
            disableThumbTooltip={true}
            isAlwaysActive={true}
          />
        </VolumeTimeRangeWrapper>
      </VolumeWrapper>
    );
  };

  onFullScreenClick = () => toggleFullscreen(this.videoWrapperRef);

  saveVideoWrapperRef = (el?: HTMLElement) => (this.videoWrapperRef = el);

  renderFullScreenButton = () => {
    const {
      intl: { formatMessage },
      type,
    } = this.props;

    if (type === 'audio') {
      return;
    }

    const { isFullScreenEnabled } = this.state;
    const icon = isFullScreenEnabled ? (
      <FullScreenIconOff label={formatMessage(messages.disable_fullscreen)} />
    ) : (
      <FullScreenIconOn label={formatMessage(messages.enable_fullscreen)} />
    );

    return (
      <MediaButton
        appearance={'toolbar' as any}
        onClick={this.onFullScreenClick}
        iconBefore={icon}
      />
    );
  };

  renderSpinner = () => (
    <SpinnerWrapper>
      <Spinner invertColor size="large" />
    </SpinnerWrapper>
  );

  private setActions(actions: VideoActions): void {
    // Actions are being sent constantly while the video is playing,
    // though play and pause functions are always the same objects
    if (!this.actions) {
      const { play, pause } = actions;
      this.actions = { play, pause };
    }
  }

  private pause = (): void => {
    if (this.actions) {
      this.actions.pause();
    }
  };

  private play = (): void => {
    if (this.actions) {
      this.actions.play();
    }
    this.simultaneousPlay.onPlay();
  };

  render() {
    const {
      type,
      src,
      isAutoPlay,
      isShortcutEnabled,
      intl: { formatMessage },
      onCanPlay,
      onError,
    } = this.props;

    return (
      <CustomVideoWrapper innerRef={this.saveVideoWrapperRef}>
        <MediaPlayer
          sourceType={type}
          src={src}
          autoPlay={isAutoPlay}
          onCanPlay={onCanPlay}
          onError={onError}
        >
          {(video, videoState, actions) => {
            this.setActions(actions);

            const {
              status,
              currentTime,
              buffered,
              duration,
              isLoading,
            } = videoState;
            const isPlaying = status === 'playing';
            const toggleButtonIcon = isPlaying ? (
              <PauseIcon label={formatMessage(messages.play)} />
            ) : (
              <PlayIcon label={formatMessage(messages.pause)} />
            );
            const toggleButtonAction = isPlaying ? this.pause : this.play;
            const button = (
              <MediaButton
                appearance={'toolbar' as any}
                iconBefore={toggleButtonIcon}
                onClick={toggleButtonAction}
              />
            );
            const shortcuts = isShortcutEnabled && [
              <Shortcut
                key="space-shortcut"
                keyCode={keyCodes.space}
                handler={this.shortcutHandler(toggleButtonAction)}
              />,
              <Shortcut
                key="m-shortcut"
                keyCode={keyCodes.m}
                handler={this.shortcutHandler(actions.toggleMute)}
              />,
            ];

            return (
              <VideoWrapper>
                {video}
                {isLoading && this.renderSpinner()}
                {shortcuts}
                <ControlsWrapper className={hideControlsClassName}>
                  <TimeWrapper>
                    <TimeRange
                      currentTime={currentTime}
                      bufferedTime={buffered}
                      duration={duration}
                      onChange={this.onTimeChange(actions.navigate)}
                    />
                  </TimeWrapper>
                  <TimebarWrapper>
                    <LeftControls>
                      {button}
                      {this.renderVolume(videoState, actions)}
                    </LeftControls>
                    <RightControls>
                      <CurrentTime draggable={false}>
                        {formatDuration(currentTime)} /{' '}
                        {formatDuration(duration)}
                      </CurrentTime>
                      {this.renderHDButton()}
                      {this.renderFullScreenButton()}
                    </RightControls>
                  </TimebarWrapper>
                </ControlsWrapper>
              </VideoWrapper>
            );
          }}
        </MediaPlayer>
      </CustomVideoWrapper>
    );
  }
}

export default injectIntl(CustomMediaPlayer);
