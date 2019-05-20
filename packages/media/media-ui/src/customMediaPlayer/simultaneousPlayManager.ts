type voidfn = () => void;

export type SimultaneousPlaySubscription = {
  onPlay: voidfn;
  unsubscribe: voidfn;
  isLastPlayed: () => boolean;
};

export default class SimultaneousPlayManager {
  private static playersPause = new Map<voidfn, voidfn>();

  private static lastPlayed: voidfn;

  static subscribe = (pause: voidfn): SimultaneousPlaySubscription => {
    if (!SimultaneousPlayManager.playersPause.get(pause)) {
      SimultaneousPlayManager.playersPause.set(pause, pause);
    }
    return {
      onPlay: () => {
        SimultaneousPlayManager.onPlay(pause);
      },
      unsubscribe: () => {
        SimultaneousPlayManager.unsubscribe(pause);
      },
      isLastPlayed: () => SimultaneousPlayManager.lastPlayed === pause,
    };
  };

  private static unsubscribe = (pause: voidfn) => {
    SimultaneousPlayManager.playersPause.delete(pause);
  };

  private static onPlay = (pause: voidfn): void => {
    SimultaneousPlayManager.lastPlayed = pause;

    SimultaneousPlayManager.playersPause.forEach(playerPause => {
      if (playerPause !== pause) playerPause();
    });
  };

  private constructor() {}
}
