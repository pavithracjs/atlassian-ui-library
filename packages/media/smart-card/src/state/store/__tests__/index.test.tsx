import { renderSmartLinkHook } from '../../../utils/test-utils';
import { useSmartCardState } from '..';
import { CardStore } from '../../types';

describe('useSmartCardState()', () => {
  let mockUrl = 'some.url';

  it('correctly returns default state', () => {
    renderSmartLinkHook(() => {
      const result = useSmartCardState(mockUrl);
      expect(result).toEqual({
        status: 'pending',
        lastUpdatedAt: expect.anything(),
      });
    });
  });

  it('correctly returns state from context', () => {
    const initialState: CardStore = {
      'some.url': {
        status: 'resolved',
        lastUpdatedAt: Date.now(),
        details: {
          meta: {
            auth: [],
            visibility: 'restricted',
            access: 'granted',
            definitionId: 'd1',
          },
        },
      },
    };
    renderSmartLinkHook(
      () => {
        const result = useSmartCardState(mockUrl);
        expect(result).toEqual(initialState['some.url']);
      },
      { storeOptions: { initialState } },
    );
  });
});
