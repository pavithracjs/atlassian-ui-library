export const LONG_PRESS_TIMEOUT = 500;

export function startLongPress(state, setState, cb) {
  const { longPressHandler } = state;

  if (!longPressHandler) {
    setState({
      longPressHandler: setTimeout(cb, LONG_PRESS_TIMEOUT),
    });
  }
}

export function clearLongPress(state, setState, cb) {
  const { longPressHandler } = state;

  if (longPressHandler) {
    cb();
    clearTimeout(longPressHandler);
    setState({
      longPressHandler: undefined,
    });
  }
}
