type Padding = { top: number; right: number; bottom: number; left: number };

export default abstract class WebBridge {
  constructor() {
    // Set initial page padding (necessary for seeing the gap cursor for some content nodes).
    // This may be overwritten at runtime by a native bridge consumer.
    this.setPadding(32, 16, 32, 16);
  }

  private padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 };

  abstract getRootElement(): HTMLElement | null;

  setPadding(
    top: number = 0,
    right: number = 0,
    bottom: number = 0,
    left: number = 0,
  ) {
    let root = this.getRootElement();
    if (root) {
      // We use margin for the top and bottom so that it doesn't affect content height calculations
      root.style.margin = `${top}px 0 ${bottom}px 0`;
      // We use padding for the sides to ensure taps within the gutter trigger the content area.
      root.style.padding = `0 ${right}px 0 ${left}px`;
      this.padding = { top, right, bottom, left };
    }
  }

  getPadding(): Padding {
    return this.padding;
  }

  reload(): void {
    window.location.reload();
  }
}
