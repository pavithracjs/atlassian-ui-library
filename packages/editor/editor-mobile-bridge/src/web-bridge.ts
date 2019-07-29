export default abstract class WebBridge {
  constructor() {
    // Set initial page padding (necessary for seeing the gap cursor for some content nodes).
    // This may be overwritten at runtime by a native bridge consumer.
    this.setPadding(32, 16, 16, 32);
  }

  abstract getRootElement(): HTMLElement | null;

  setPadding(
    top: number = 0,
    right: number = 0,
    bottom: number = 0,
    left: number = 0,
  ) {
    let root = this.getRootElement();
    if (root) {
      root.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    }
  }
}
