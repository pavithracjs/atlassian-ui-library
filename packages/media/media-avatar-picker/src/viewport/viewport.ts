import { Rectangle, Bounds, Vector2 } from '@atlaskit/media-ui';

export const MAX_SCALE = 4;

/**
 * This class abstracts viewing an item within a container.
 * This class is display agnostic, it only calculates the geometry.
 * The container can have a uniform margin which allows for transparent clipping of the view area.
 * This creates an inner bounds within the container, which is (container size - margin).
 * When given an item, the viewport will scale up the item bounds to fit the inner bounds.
 * The viewport can work with drag events, but will constrain the item bounds to never be smaller than the minimum container side length.
 * The viewport can work with zoom events, but will constrain the item bounds to never be smaller than the minimum container side length.
 * The viewport can map coordinates from the inner bounds, to the image local coordinates.
 */

export class Viewport {
  private itemSourceRect: Rectangle = new Rectangle(0, 0);
  private dragStartPos: Vector2 = new Vector2(0, 0);
  itemBounds: Bounds = new Bounds(0, 0, 0, 0);
  orientation: number = 1;
  onChange?: () => void;
  onMouseMove?: (x: number, y: number) => void;

  constructor(
    readonly width: number,
    readonly height: number,
    readonly margin: number = 0,
  ) {
    // it's assumed we won't have an item size yet as it is something that requires async loading.
    // when ready, call setItemSize(w, h) to "load/init" the item for the viewport
  }

  private onChanged() {
    if (this.onChange) {
      this.onChange();
    }
  }

  get innerBounds() {
    const { margin, width, height } = this;
    return new Bounds(margin, margin, width - margin * 2, height - margin * 2);
  }

  get outerBounds() {
    return new Bounds(0, 0, this.width, this.height);
  }

  get visibleSourceRect() {
    const { innerBounds } = this;
    const origin = this.viewToLocalPoint(0, 0);
    const corner = this.viewToLocalPoint(innerBounds.width, innerBounds.height);
    return new Bounds(
      origin.x,
      origin.y,
      corner.x - origin.x,
      corner.y - origin.y,
    );
  }

  get itemSourceBounds() {
    const { itemSourceRect } = this;
    return new Bounds(0, 0, itemSourceRect.width, itemSourceRect.height);
  }

  get fittedItemBounds() {
    const { margin, itemSourceRect, innerBounds } = this;
    const ratio = itemSourceRect.scaleToFitSmallestSide(innerBounds.rect);
    const width = itemSourceRect.width * ratio;
    const height = itemSourceRect.height * ratio;
    const x = margin + (innerBounds.width - width) * 0.5;
    const y = margin + (innerBounds.height - height) * 0.5;
    return new Bounds(x, y, width, height);
  }

  get hasValidItemSize() {
    return this.itemSourceRect.width > 0 && this.itemSourceRect.height > 0;
  }

  setItemSize(width: number, height: number) {
    this.itemSourceRect = new Rectangle(width, height);
    this.zoomToFit();
    return this;
  }

  setScale(scale: number) {
    const { fittedItemBounds, itemBounds, innerBounds } = this;
    if (scale <= 1) {
      this.itemBounds = fittedItemBounds;
    } else {
      const scaleFromMax = MAX_SCALE * (scale / 100);
      const maxWidth = fittedItemBounds.width * MAX_SCALE;
      const maxHeight = fittedItemBounds.height * MAX_SCALE;
      const width =
        fittedItemBounds.width +
        (maxWidth - fittedItemBounds.width) * scaleFromMax;
      const height =
        fittedItemBounds.height +
        (maxHeight - fittedItemBounds.height) * scaleFromMax;
      const scaledBounds = new Bounds(
        itemBounds.x,
        itemBounds.y,
        width,
        height,
      );
      const localCenterBefore = this.viewToLocalPoint(
        innerBounds.width * 0.5,
        innerBounds.height * 0.5,
      );
      const center = itemBounds.center;
      const left = center.x - scaledBounds.width * 0.5;
      const top = center.y - scaledBounds.height * 0.5;
      this.itemBounds = new Bounds(
        left,
        top,
        scaledBounds.width,
        scaledBounds.height,
      );
      const localCenterAfter = this.viewToLocalPoint(
        innerBounds.width * 0.5,
        innerBounds.height * 0.5,
      );
      this.itemBounds = this.itemBounds.translated(
        localCenterAfter.x - localCenterBefore.x,
        localCenterAfter.y - localCenterBefore.y,
      );
      this.applyConstraints();
    }
    this.onChanged();
    return this;
  }

  zoomToFit() {
    this.itemBounds = this.fittedItemBounds;
    this.onChanged();
    return this;
  }

  startDrag() {
    this.dragStartPos = this.itemBounds.origin;
    return this;
  }

  dragMove(xDelta: number, yDelta: number) {
    const { dragStartPos, itemBounds } = this;
    const x = dragStartPos.x + xDelta;
    const y = dragStartPos.y + yDelta;
    this.itemBounds = new Bounds(x, y, itemBounds.width, itemBounds.height);
    this.applyConstraints();
    this.onChanged();
    return this;
  }

  mouseMove(viewX: number, viewY: number) {
    if (this.onMouseMove) {
      this.onMouseMove(viewX, viewY);
    }
  }

  applyConstraints() {
    const { innerBounds, itemBounds } = this;
    const deltaLeft = innerBounds.left - itemBounds.left;
    const deltaTop = innerBounds.top - itemBounds.top;
    const deltaBottom = innerBounds.bottom - itemBounds.bottom;
    const deltaRight = innerBounds.right - itemBounds.right;

    let x = itemBounds.left;
    let y = itemBounds.top;

    if (
      itemBounds.right > innerBounds.right &&
      itemBounds.left > innerBounds.left
    ) {
      x += deltaLeft;
    }
    if (
      itemBounds.bottom > innerBounds.bottom &&
      itemBounds.top > innerBounds.top
    ) {
      y += deltaTop;
    }
    if (
      itemBounds.top < innerBounds.top &&
      itemBounds.bottom < innerBounds.bottom
    ) {
      y += deltaBottom;
    }
    if (
      itemBounds.left < innerBounds.left &&
      itemBounds.right < innerBounds.right
    ) {
      x += deltaRight;
    }

    this.itemBounds = new Bounds(x, y, itemBounds.width, itemBounds.height);
  }

  viewToLocalPoint(viewX: number, viewY: number): Vector2 {
    const { itemSourceRect, itemBounds, innerBounds } = this;
    const offset = innerBounds.origin.sub(itemBounds.origin);
    const rect = itemBounds.rect;
    const localX = (offset.x + viewX) / rect.width;
    const localY = (offset.y + viewY) / rect.height;
    return new Vector2(
      itemSourceRect.width * localX,
      itemSourceRect.height * localY,
    );
  }
}
