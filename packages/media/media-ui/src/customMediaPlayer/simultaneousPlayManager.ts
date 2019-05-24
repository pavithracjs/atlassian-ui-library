export interface Pausable {
  pause: () => any;
}

const players: Pausable[] = [];

const isPlayerSubscribed = (player: Pausable) => players.indexOf(player) > -1;

const addPlayer = (player: Pausable) => players.push(player);

const removePlayer = (player: Pausable) => {
  if (isPlayerSubscribed) {
    const playerIndex = players.indexOf(player);
    players.splice(playerIndex, 1);
  }
};

export default {
  pauseOthers: (player: Pausable) => {
    players.forEach(otherPlayer => {
      if (otherPlayer !== player) {
        otherPlayer.pause();
      }
    });
  },
  subscribe: (player: Pausable) => {
    if (!isPlayerSubscribed(player)) {
      addPlayer(player);
    }
  },
  unsubscribe: (player: Pausable) => {
    removePlayer(player);
  },
};
