let startTime: number = Date.now();

export const resetTimer = () => (startTime = Date.now());
export const timerElapsed = () => Date.now() - startTime;
