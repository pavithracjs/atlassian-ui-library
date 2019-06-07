import {
  buttonClicked,
  cancelShare,
  copyShareLink,
  screenEvent,
  submitShare,
} from '../../../components/analytics';
import {
  ConfigResponse,
  DialogContentState,
  OriginTracing,
} from '../../../types';
import { Team } from '@atlaskit/user-picker';

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
        actionSubjectId: 'cancelShare',
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
    it('should create event payload without share content type and origin id', () => {
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

    it('should create event payload without origin id', () => {
      expect(submitShare(100, data, 'issue')).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
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
      expect(submitShare(100, data, 'issue', shareOrigin)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
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
      expect(
        submitShare(100, data, 'issue', shareOrigin, config),
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
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

    // team analytics related
    const teams: Team[] = [
      {
        type: 'team',
        id: 'abc-123',
        name: 'some team 1',
        memberCount: 2,
      },
      {
        type: 'team',
        id: 'abc-1234',
        name: 'some team 2',
        memberCount: 5,
      },
    ];

    const dataWithMembers: DialogContentState = {
      users: teams,
      comment: {
        format: 'plain_text',
        value: 'Some comment',
      },
    };
    it('should create event payload with team member counts', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();
      const config: ConfigResponse = {
        mode: 'ANYONE',
        allowComment: true,
      };
      expect(
        submitShare(100, dataWithMembers, 'issue', shareOrigin, config),
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
          duration: expect.any(Number),
          teamCount: 2,
          userCount: 0,
          emailCount: 0,
          teams: ['abc-123', 'abc-1234'],
          teamUserCounts: [2, 5],
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

    it('should create event payload with team member counts when some ember counts are undefined', () => {
      teams.push({
        type: 'team',
        id: 'abc-1235',
        name: 'some team 2',
      });
      const shareOrigin: OriginTracing = mockShareOrigin();
      const config: ConfigResponse = {
        mode: 'ANYONE',
        allowComment: true,
      };

      expect(
        submitShare(100, dataWithMembers, 'issue', shareOrigin, config),
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
          duration: expect.any(Number),
          teamCount: 3,
          userCount: 0,
          emailCount: 0,
          teams: ['abc-123', 'abc-1234', 'abc-1235'],
          teamUserCounts: [2, 5, 0],
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
