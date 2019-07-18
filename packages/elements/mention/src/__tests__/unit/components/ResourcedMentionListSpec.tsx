import * as React from 'react';
import { shallow } from 'enzyme';
import { MockMentionResource } from '../../../../../util-data-test/src/mention/MockMentionResource';
import MentionList from '../../..//components/MentionList';
import ResourcedMentionList, {
  Props,
} from '../../../components/ResourcedMentionList';

describe('ResourcedMentionList', () => {
  const mockResourceProvider = new MockMentionResource({
    minWait: 0,
    maxWait: 0,
  });

  const defaultProps: Props = {
    resourceProvider: mockResourceProvider,
  };

  function render(props?: Partial<Props>) {
    return shallow(<ResourcedMentionList {...defaultProps} {...props} />);
  }

  it('should show the highlight if conditions are just right', () => {
    const element = render({ isTeamMentionHighlightEnabled: true });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const spotlight = element.find(MentionList).props().initialHighlightElement;
    expect(spotlight).toBeDefined();
  });

  it('should not show the highlight if there are no users', () => {
    const element = render({ isTeamMentionHighlightEnabled: true });
    element.setState({ mentions: [] });

    const spotlight = element.find(MentionList).props().initialHighlightElement;
    expect(spotlight).toBeNull();
  });

  it('should not show the highlight if the spotlight flag is disabled', () => {
    const element = render({ isTeamMentionHighlightEnabled: false });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const spotlight = element.find(MentionList).props().initialHighlightElement;
    expect(spotlight).toBeNull();
  });

  it('should not show the highlight if the spotlight has been closed by the user', () => {
    const element = render({ isTeamMentionHighlightEnabled: true });
    element.setState({
      mentions: [{ id: 'someUser' }],
      isHighlightClosed: true,
    });

    const spotlight = element.find(MentionList).props().initialHighlightElement;
    expect(spotlight).toBeNull();
  });
});
