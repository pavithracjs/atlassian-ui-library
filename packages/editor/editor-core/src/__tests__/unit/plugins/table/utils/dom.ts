import {
  getMousePositionHorizontalRelativeByElement,
  getMousePositionVerticalRelativeByElement,
} from '../../../../../plugins/table/utils/dom';

describe('table plugin: utils/dom.js', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');

    element.getBoundingClientRect = () => ({
      width: 100,
      left: 50,
      height: 100,
      top: 50,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
    });
  });

  describe('#getMousePositionHorizontalRelativeByElement', () => {
    it('should returns right when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        clientX: 50,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('left');
    });

    it('should returns left when the mouse is positioned after half of the element', () => {
      const event = {
        target: element,
        clientX: 101,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('right');
    });
  });

  describe('#getMousePositionVerticalRelativeByElement', () => {
    it('should returns top when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        clientY: 50,
      };

      expect(
        // @ts-ignore
        getMousePositionVerticalRelativeByElement(event),
      ).toBe('top');
    });

    it('should returns bottom when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        clientY: 101,
      };

      expect(
        // @ts-ignore
        getMousePositionVerticalRelativeByElement(event),
      ).toBe('bottom');
    });
  });
});
