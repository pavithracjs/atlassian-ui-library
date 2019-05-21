import simultaneousPlayManager, {
  SimultaneousPlaySubscription,
} from '../../customMediaPlayer/simultaneousPlayManager';

class DummyVideo {
  pause: () => void;
  subscription: SimultaneousPlaySubscription;

  constructor() {
    this.pause = jest.fn();
    this.subscription = simultaneousPlayManager.subscribe(this.pause);
  }
  play() {
    this.subscription.onPlay();
  }
  unsubscribe() {
    this.subscription.unsubscribe();
  }
}

describe('Simultaneous Play Manager', () => {
  it('should pause all subscribed players, but the current playing one', () => {
    const videoOne = new DummyVideo();
    const videoTwo = new DummyVideo();
    const videoThree = new DummyVideo();

    videoOne.play();

    expect(videoOne.pause).not.toBeCalled();
    expect(videoTwo.pause).toBeCalledTimes(1);
    expect(videoThree.pause).toBeCalledTimes(1);
  });

  it('should not pause unsubscribed players', () => {
    const videoOne = new DummyVideo();
    const videoTwo = new DummyVideo();
    const videoThree = new DummyVideo();

    videoTwo.unsubscribe();
    videoOne.play();

    expect(videoOne.pause).not.toBeCalled();
    expect(videoTwo.pause).not.toBeCalled();
    expect(videoThree.pause).toBeCalledTimes(1);
  });

  it('should subscribe players only once', () => {
    const videoOne = new DummyVideo(); // Subscribes
    videoOne.subscription = simultaneousPlayManager.subscribe(videoOne.pause); // tries to subscribe again

    simultaneousPlayManager.subscribe(() => {}).onPlay();
    expect(videoOne.pause).toBeCalledTimes(1);
  });

  it('should tell whether the current player was the last played or not', () => {
    const videoOne = new DummyVideo();
    const videoTwo = new DummyVideo();

    videoOne.play();
    videoTwo.play();

    expect(videoOne.subscription.isLastPlayed()).toBe(false);
    expect(videoTwo.subscription.isLastPlayed()).toBe(true);
  });
});
