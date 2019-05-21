export type SimultaneousPlaySubscription = {
  onPlay: () => void;
  unsubscribe: () => void;
  isLastPlayed: () => boolean;
};

export default class SimultaneousPlayManager {
  private static playersPause = new Map<() => void, () => void>();

  private static lastPlayed: () => void;

  static subscribe = (pause: () => void): SimultaneousPlaySubscription => {
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

  private static unsubscribe = (pause: () => void) => {
    SimultaneousPlayManager.playersPause.delete(pause);
  };

  private static onPlay = (pause: () => void): void => {
    SimultaneousPlayManager.lastPlayed = pause;

    SimultaneousPlayManager.playersPause.forEach(playerPause => {
      if (playerPause !== pause) {
        playerPause();
      }
    });
  };

  private constructor() {}
}
