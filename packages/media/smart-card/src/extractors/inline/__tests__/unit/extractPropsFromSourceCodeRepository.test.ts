import { extractInlineViewPropsFromSourceCodeRepository } from '../../extractPropsFromSourceCodeRepository';

describe('extractInlineViewPropsFromSourceCodeRepository', () => {
  it('should just set the name properly (with no other information)', () => {
    const props = extractInlineViewPropsFromSourceCodeRepository({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some branch',
    });
    expect(props).toHaveProperty('title', 'some branch');
  });

  it('should set the name with both repo name and internal id', () => {
    const props = extractInlineViewPropsFromSourceCodeRepository({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some branch',
      'atlassian:internalObjectId': 'fix/AB-1234',
      'atlassian:repositoryName': 'my-repo',
    });
    expect(props).toHaveProperty('title', 'my-repo/fix/AB-1234: some branch');
  });

  it('should set the name with only repo name (no internal id)', () => {
    const props = extractInlineViewPropsFromSourceCodeRepository({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some branch',
      'atlassian:repositoryName': 'my-repo',
    });
    expect(props).toHaveProperty('title', 'my-repo: some branch');
  });

  it('should set the name with only internal id (no repo name)', () => {
    const props = extractInlineViewPropsFromSourceCodeRepository({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some branch',
      'atlassian:internalObjectId': 'fix/AB-1234',
    });
    expect(props).toHaveProperty('title', 'fix/AB-1234: some branch');
  });
});
