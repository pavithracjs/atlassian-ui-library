import * as React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import ResizableMediaSingle from '../../../../../plugins/media/ui/ResizableMediaSingle';
import { Wrapper } from '../../../../../plugins/media/ui/ResizableMediaSingle/styled';

describe('resizable-media-single', () => {
  const view = {} as EditorView;
  const state = {} as EditorState;

  describe('calc width based on layout alignments', () => {
    describe('when the width is less than lineLength', () => {
      it('should keep the width for layout center', () => {
        const wrapper = mount(
          <ResizableMediaSingle
            layout="center"
            width={400}
            height={400}
            containerWidth={1200}
            lineLength={500}
            updateSize={jest.fn()}
            displayGrid={jest.fn()}
            getPos={jest.fn()}
            gridSize={12}
            selected={false}
            view={view}
            state={state}
          >
            <span>1</span>
          </ResizableMediaSingle>,
        );
        const resizableWrapperProps = wrapper.find(Wrapper).props();

        expect(resizableWrapperProps.width).toBe(400);
      });
    });

    describe('when the width is greater than lineLength', () => {
      it('should use lineLength width for layout center', () => {
        const wrapper = mount(
          <ResizableMediaSingle
            layout="center"
            width={900}
            height={400}
            containerWidth={1200}
            lineLength={500}
            updateSize={jest.fn()}
            displayGrid={jest.fn()}
            getPos={jest.fn()}
            gridSize={12}
            selected={false}
            view={view}
            state={state}
          >
            <span>1</span>
          </ResizableMediaSingle>,
        );
        const resizableWrapperProps = wrapper.find(Wrapper).props();

        expect(resizableWrapperProps.width).toBe(500);
      });
    });

    describe('when the width is less than lineLength', () => {
      let wrapper = mount(<span />);
      beforeEach(() => {
        wrapper = mount(
          <ResizableMediaSingle
            layout="center"
            width={400}
            height={400}
            containerWidth={1200}
            lineLength={500}
            updateSize={jest.fn()}
            displayGrid={jest.fn()}
            getPos={jest.fn()}
            gridSize={12}
            selected={false}
            view={view}
            state={state}
          >
            <span>1</span>
          </ResizableMediaSingle>,
        );
      });

      it('should use half of lineLength for align-start', () => {
        wrapper.setProps({ layout: 'align-start' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for align-end', () => {
        wrapper.setProps({ layout: 'align-end' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-left', () => {
        wrapper.setProps({ layout: 'wrap-left' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-right', () => {
        wrapper.setProps({ layout: 'wrap-right' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });
    });

    describe('when the width is greater than lineLength', () => {
      let wrapper = mount(<span />);
      beforeEach(() => {
        wrapper = mount(
          <ResizableMediaSingle
            layout="center"
            width={900}
            height={400}
            containerWidth={1200}
            lineLength={500}
            updateSize={jest.fn()}
            displayGrid={jest.fn()}
            getPos={jest.fn()}
            gridSize={12}
            selected={false}
            view={view}
            state={state}
          >
            <span>1</span>
          </ResizableMediaSingle>,
        );
      });

      it('should use half of lineLength for align-start', () => {
        wrapper.setProps({ layout: 'align-start' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for align-end', () => {
        wrapper.setProps({ layout: 'align-end' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-left', () => {
        wrapper.setProps({ layout: 'wrap-left' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-right', () => {
        wrapper.setProps({ layout: 'wrap-right' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });
    });

    describe('when the pctWidth is 100', () => {
      let wrapper = mount(<span />);
      beforeEach(() => {
        wrapper = mount(
          <ResizableMediaSingle
            layout="center"
            width={900}
            height={400}
            containerWidth={1200}
            lineLength={500}
            updateSize={jest.fn()}
            displayGrid={jest.fn()}
            getPos={jest.fn()}
            gridSize={12}
            selected={false}
            view={view}
            state={state}
            pctWidth={100}
          >
            <span>1</span>
          </ResizableMediaSingle>,
        );
      });

      it('should use half of lineLength for align-start', () => {
        wrapper.setProps({ layout: 'align-start' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for align-end', () => {
        wrapper.setProps({ layout: 'align-end' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-left', () => {
        wrapper.setProps({ layout: 'wrap-left' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-right', () => {
        wrapper.setProps({ layout: 'wrap-right' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });
    });

    describe('when the pctWidth is greater than 100', () => {
      let wrapper = mount(<span />);
      beforeEach(() => {
        wrapper = mount(
          <ResizableMediaSingle
            layout="center"
            width={900}
            height={400}
            containerWidth={1200}
            lineLength={500}
            updateSize={jest.fn()}
            displayGrid={jest.fn()}
            getPos={jest.fn()}
            gridSize={12}
            selected={false}
            view={view}
            state={state}
            pctWidth={101}
          >
            <span>1</span>
          </ResizableMediaSingle>,
        );
      });

      it('should use half of lineLength for align-start', () => {
        wrapper.setProps({ layout: 'align-start' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for align-end', () => {
        wrapper.setProps({ layout: 'align-end' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-left', () => {
        wrapper.setProps({ layout: 'wrap-left' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });

      it('should use half of lineLength for wrap-right', () => {
        wrapper.setProps({ layout: 'wrap-right' });
        const resizableWrapperProps = wrapper.find(Wrapper).props();
        expect(resizableWrapperProps.width).toBe(250);
      });
    });
  });
});
