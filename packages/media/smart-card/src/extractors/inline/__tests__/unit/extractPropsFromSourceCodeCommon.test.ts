import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractInlineViewPropsFromObject } from '../../extractPropsFromObject';
import { buildName } from '../../extractPropsFromSourceCodeCommon';

export const extractInlineViewProps = (
  json: any,
): InlineCardResolvedViewProps => extractInlineViewPropsFromObject(json);

describe('extractInlineViewPropsFromSourceCodeCommon', () => {
  describe('buildName', () => {
    it('should just set the name properly (with no other information)', () => {
      const props: any = {
        url: 'https://bitbucket.org/atlassian/pull-requests/190',
        name: 'some branch',
      };
      const nameProps = buildName(extractInlineViewProps(props), props);
      expect(nameProps).toEqual({ title: 'some branch' });
    });

    it('should set the name with both repo name and internal id', () => {
      const props: any = {
        url: 'https://bitbucket.org/atlassian/pull-requests/190',
        name: 'some branch',
        'atlassian:internalObjectId': 'fix/AB-1234',
        'atlassian:repositoryName': 'my-repo',
      };
      const nameProps = buildName(extractInlineViewProps(props), props);
      expect(nameProps).toEqual({ title: 'my-repo/fix/AB-1234: some branch' });
    });

    it('should set the name with only repo name (no internal id)', () => {
      const props: any = {
        url: 'https://bitbucket.org/atlassian/pull-requests/190',
        name: 'some branch',
        'atlassian:repositoryName': 'my-repo',
      };
      const nameProps = buildName(extractInlineViewProps(props), props);
      expect(nameProps).toEqual({ title: 'my-repo: some branch' });
    });

    it('should set the name with only internal id (no repo name)', () => {
      const props: any = {
        url: 'https://bitbucket.org/atlassian/pull-requests/190',
        name: 'some branch',
        'atlassian:internalObjectId': 'fix/AB-1234',
      };
      const nameProps = buildName(extractInlineViewProps(props), props);
      expect(nameProps).toEqual({ title: 'fix/AB-1234: some branch' });
    });
  });
});
