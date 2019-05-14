export function add<P = {}>(fn: (props: P) => number, addend: number) {
  return (props: P) => fn(props) + addend;
}

export function subtract<P = {}>(fn: (props: P) => number, subtrahend: number) {
  return (props: P) => fn(props) - subtrahend;
}

export function multiply<P = {}>(fn: (props: P) => number, factor: number) {
  return (props: P) => fn(props) * factor;
}

export function divide<P = {}>(fn: (props: P) => number, divisor: number) {
  return (props: P) => fn(props) / divisor;
}
