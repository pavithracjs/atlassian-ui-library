type voidfn = () => void;

export type SimultaneousPlaySubscription = {
  onPlay: voidfn;
  unsubscribe: voidfn;
};

export default class SPM {
  // Simultaneous Play Manager
  private static playersPause = new Map<voidfn, voidfn>();

  static subscribe = (pause: voidfn): SimultaneousPlaySubscription => {
    if (!SPM.playersPause.get(pause)) {
      SPM.playersPause.set(pause, pause);
    }
    return {
      onPlay: () => SPM.onPlay(pause),
      unsubscribe: () => SPM.unsubscribe(pause),
    };
  };

  private static unsubscribe = (pause: voidfn) => {
    SPM.playersPause.delete(pause);
  };

  private static onPlay = (pause: voidfn): void => {
    SPM.playersPause.forEach(playerPause => {
      if (playerPause !== pause) playerPause();
    });
  };

  private constructor() {}
}
