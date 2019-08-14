import resetView from '../../resetView';
import { State } from '../../../domain';

describe('resetView reducer', () => {
  const action = { type: 'RESET_VIEW' };

  it('should not change the state for an unknown action', () => {
    const otherAction = { type: 'SOME_OTHER_TYPE' };

    const stateBase: any = { a: 12, b: 'line' };
    const oldState = { ...stateBase };
    const newState = resetView(oldState, otherAction);

    expect(newState).toEqual(stateBase);
  });

  it('should not change uploads if they were empty', () => {
    const oldState: any = {
      uploads: {},
    };

    const newState = resetView(oldState, action);

    expect(newState.uploads).toEqual({});
  });

  it('should drop only fully uploaded and processed ones', () => {
    const oldState: Partial<State> = {
      uploads: {
        'ended-file-id': {
          file: {} as any,
          index: 0,
          timeStarted: 0,
          progress: 1,
          events: [
            {
              name: 'upload-end',
              data: {} as any,
            },
          ],
        },
        'errored-file-id': {
          file: {} as any,
          index: 0,
          timeStarted: 0,
          progress: 1,
          events: [
            {
              name: 'upload-error',
              data: {} as any,
            },
          ],
        },
        'non-finished-file-id': {
          file: {} as any,
          index: 0,
          timeStarted: 0,
          progress: 1,
          events: [
            {
              name: 'upload-preview-update',
              data: {} as any,
            },
          ],
        },
      },
    };

    const newState = resetView(oldState as State, action);

    expect(Object.keys(newState.uploads)).toEqual(['non-finished-file-id']);
  });

  it('should set empty selectedItems', () => {
    const oldState: any = {
      uploads: {},
      selectedItems: ['first', 'second'],
    };

    const newState = resetView(oldState, action);

    expect(newState.selectedItems).toEqual([]);
  });

  it('should preserve the unrelated state fields', () => {
    const stateData = {
      a: 12,
      b: 'some-string',
    };
    const oldState: any = {
      ...stateData,
      uploads: {},
    };

    const newState = resetView(oldState, action);

    expect(newState).toEqual(expect.objectContaining(stateData));
  });
});
