import { extractInlineViewPropsFromSourceCodeReference } from '../../extractPropsFromSourceCodeReference';
import { ReactElement } from 'react';
import { shallow } from 'enzyme';

describe('extractInlineViewPropsFromSourceCodeReference', () => {
  it('should set the icon to the appropriate default icon', () => {
    const props = extractInlineViewPropsFromSourceCodeReference({
      name: 'title yeee',
    });
    expect(props).toHaveProperty('title', 'title yeee');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('title yeee');
  });

  it('should just set the name properly (with no other information)', () => {
    const props = extractInlineViewPropsFromSourceCodeReference({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some commit',
    });
    expect(props).toHaveProperty('title', 'some commit');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some commit');
  });

  it('should set the name with both repo name and internal id', () => {
    const props = extractInlineViewPropsFromSourceCodeReference({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some commit',
      'atlassian:internalObjectId': 'baadf00d',
      'atlassian:repositoryName': 'my-repo',
    });
    expect(props).toHaveProperty('title', 'my-repo/baadf00d: some commit');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some commit');
  });

  it('should set the name with only repo name (no internal id)', () => {
    const props = extractInlineViewPropsFromSourceCodeReference({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some commit',
      'atlassian:repositoryName': 'my-repo',
    });
    expect(props).toHaveProperty('title', 'my-repo: some commit');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some commit');
  });

  it('should set the name with only internal id (no repo name)', () => {
    const props = extractInlineViewPropsFromSourceCodeReference({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some commit',
      'atlassian:internalObjectId': 'baadf00d',
    });
    expect(props).toHaveProperty('title', 'baadf00d: some commit');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some commit');
  });
});
