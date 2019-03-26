import {
  buttonClicked,
  cancelShare,
  copyShareLink,
  screenEvent,
  submitShare,
} from '../../analytics';
import { ConfigResponse, DialogContentState, OriginTracing } from '../../types';

describe('share analytics', () => {
  const mockShareOrigin = (): OriginTracing => ({
    id: 'abc-123',
    addToUrl: (link: string): string => `${link}?originId=abc-123`,
    toAnalyticsAttributes: jest.fn(() => ({
      originIdGenerated: 'abc-123',
      originProduct: 'jest',
    })),
  });

  describe('buttonClicked', () => {
    it('should create event payload', () => {
      expect(buttonClicked()).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'share',
        attributes: expect.objectContaining({
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });
  });

  describe('cancelShare', () => {
    it('should create event payload', () => {
      expect(cancelShare(100)).toMatchObject({
        eventType: 'ui',
        action: 'pressed',
        actionSubject: 'keyboardShortcut',
        actionSubjectId: 'share',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });
  });

  describe('screenEvent', () => {
    it('should create event payload', () => {
      expect(screenEvent()).toMatchObject({
        eventType: 'screen',
        name: 'shareModal',
        attributes: expect.objectContaining({
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });
  });

  describe('copyShareLink', () => {
    it('should create event payload without origin id', () => {
      expect(copyShareLink(100)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'copyShareLink',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });

    it('should create event payload with origin id', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();
      expect(copyShareLink(100, shareOrigin)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'copyShareLink',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          originIdGenerated: 'abc-123',
          originProduct: 'jest',
        }),
      });
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });
  });

  describe('submitShare', () => {
    const data: DialogContentState = {
      users: [
        {
          type: 'user',
          id: 'abc-123',
          name: 'some user',
        },
        {
          type: 'team',
          id: '123-abc',
          name: 'some user',
        },
        {
          type: 'email',
          id: 'test@atlassian.com',
          name: 'some user',
        },
      ],
      comment: {
        format: 'plain_text',
        value: 'Some comment',
      },
    };
    it('should create event payload without origin id', () => {
      expect(submitShare(100, data)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          teamCount: 1,
          userCount: 1,
          emailCount: 1,
          users: ['abc-123'],
          teams: ['123-abc'],
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          isMessageEnabled: false,
          messageLength: 0,
        }),
      });
    });

    it('should create event payload with origin id', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();
      expect(submitShare(100, data, shareOrigin)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          teamCount: 1,
          userCount: 1,
          emailCount: 1,
          users: ['abc-123'],
          teams: ['123-abc'],
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          isMessageEnabled: false,
          messageLength: 0,
          originIdGenerated: 'abc-123',
          originProduct: 'jest',
        }),
      });
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });

    it('should create event payload with origin id and config', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();
      const config: ConfigResponse = {
        mode: 'ANYONE',
        allowComment: true,
      };
      expect(submitShare(100, data, shareOrigin, config)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          teamCount: 1,
          userCount: 1,
          emailCount: 1,
          users: ['abc-123'],
          teams: ['123-abc'],
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          isMessageEnabled: true,
          messageLength: 12,
          originIdGenerated: 'abc-123',
          originProduct: 'jest',
        }),
      });
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });
  });
});
