type voidfn = () => void;

export type SimultaneousPlaySubscription = {
  onPlay: voidfn;
  unsubscribe: voidfn;
};

const playersPause = new Map<voidfn, voidfn>();

const onPlayerPlay = (pause: voidfn): void => {
  playersPause.forEach(playerPause => {
    if (playerPause !== pause) playerPause();
  });
};

const unsubscribePlayer = (pause: voidfn) => {
  playersPause.delete(pause);
};

export default (pause: voidfn): SimultaneousPlaySubscription => {
  console.log('me llego esta pause', pause);
  if (!playersPause.get(pause)) {
    playersPause.set(pause, pause);
  }
  return {
    onPlay: () => onPlayerPlay(pause),
    unsubscribe: () => unsubscribePlayer(pause),
  };
};
