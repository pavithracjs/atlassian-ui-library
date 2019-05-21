import { Viewport } from '../src/viewport/viewport';
import { renderViewport } from '../src/viewport/viewport-render';

/**
 * This is a helper class to render debug info for a viewport.
 * Useful for interactively seeing if everything is working when manually testing first.
 *
 * This component will add itself to document.body when it loads, you can set where it should overlay in constructor.
 * Just instantiate it with a viewport and some display position settings and you're good.
 */

interface Pos {
  x: number;
  y: number;
}

export class ViewportDebugger {
  private navigationCanvas: HTMLCanvasElement = document.createElement(
    'canvas',
  );
  private previewCanvas: HTMLCanvasElement = document.createElement('canvas');
  public imageElement?: HTMLImageElement;

  constructor(
    private readonly viewport: Viewport,
    private readonly navigationCanvasPos: Pos,
    private readonly previewCanvasPos: Pos,
  ) {
    viewport.onChange = this.onChange;
    viewport.onMouseMove = this.onMouseMove;
    this.initCanvas();
    this.render();
  }

  onChange = () => {
    const { viewport } = this;
    if (viewport.item) {
      this.imageElement = viewport.item as HTMLImageElement;
    }
    this.render();
  };

  onMouseMove = (viewX: number, viewY: number) => {
    const { navigationCanvas, viewport } = this;
    const { x: localX, y: localY } = viewport.viewToLocalPoint(viewX, viewY);
    this.renderNavigation();
    const ctx = navigationCanvas.getContext('2d');
    if (ctx) {
      const fontSize = 12;
      const fontYOffset = viewport.margin + fontSize;
      ctx.fillStyle = 'blue';
      ctx.font = `${fontSize}px courier`;
      ctx.fillText(
        `  view: ${Math.round(viewX)} x ${Math.round(viewY)}`,
        viewport.margin,
        fontYOffset,
      );
      ctx.fillText(
        `source: ${Math.floor(localX)} x ${Math.floor(localY)}`,
        viewport.margin,
        fontYOffset + fontSize,
      );
    }
  };

  initCanvas() {
    const {
      previewCanvas,
      navigationCanvasPos,
      previewCanvasPos,
      viewport,
    } = this;
    const { innerBounds } = viewport;
    previewCanvas.width = innerBounds.width;
    previewCanvas.height = innerBounds.height;
    this.navigationCanvas.style.cssText = `
        position: absolute;
        left: ${navigationCanvasPos.x}px;
        top: ${navigationCanvasPos.y}px;
        z-index: 1000;
        box-shadow: 10px 10px 20px 1px rgba(0,0,0,0.3);
        `;
    document.body.appendChild(this.navigationCanvas);
    this.previewCanvas.style.cssText = `
        position: absolute;
        left: ${previewCanvasPos.x}px;
        top: ${previewCanvasPos.y}px;
        z-index: 1000;
        box-shadow: 10px 10px 20px 1px rgba(0,0,0,0.3);
        width: ${innerBounds.width}px;
        height: ${innerBounds.height}px;
    `;
    document.body.appendChild(this.previewCanvas);
  }

  render() {
    this.renderNavigation();
    this.renderPreview();
  }

  renderNavigation() {
    const { navigationCanvas } = this;
    const { itemBounds, outerBounds, innerBounds } = this.viewport;
    const ctx = navigationCanvas.getContext('2d');
    if (ctx) {
      navigationCanvas.width = outerBounds.width;
      navigationCanvas.height = outerBounds.height;
      // bg
      ctx.fillStyle = '#ccc';
      ctx.fillRect(0, 0, outerBounds.width, outerBounds.height);
      // innerBounds
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(
        innerBounds.left,
        innerBounds.top,
        innerBounds.width,
        innerBounds.height,
      );
      // black outline
      ctx.strokeStyle = '#000';
      ctx.strokeRect(0, 0, outerBounds.width, outerBounds.height);
      // item bounds
      ctx.fillStyle = '#00ff002b';
      ctx.fillRect(
        itemBounds.left,
        itemBounds.top,
        itemBounds.width,
        itemBounds.height,
      );
      // item border
      ctx.strokeStyle = 'green';
      ctx.strokeRect(
        itemBounds.left,
        itemBounds.top,
        itemBounds.width,
        itemBounds.height,
      );
      // cross lines
      ctx.beginPath();
      ctx.moveTo(itemBounds.left, itemBounds.top);
      ctx.lineTo(itemBounds.right, itemBounds.bottom);
      ctx.stroke();
      ctx.moveTo(itemBounds.left, itemBounds.bottom);
      ctx.lineTo(itemBounds.right, itemBounds.top);
      ctx.stroke();
      ctx.closePath();
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(
        innerBounds.left,
        innerBounds.top,
        innerBounds.width,
        innerBounds.height,
      );
    }
  }

  renderPreview() {
    const { previewCanvas, viewport, imageElement } = this;
    const { outerBounds } = viewport;
    previewCanvas.width = outerBounds.width;
    previewCanvas.height = outerBounds.height;
    if (imageElement) {
      renderViewport(viewport, imageElement, previewCanvas);
    }
  }
}
