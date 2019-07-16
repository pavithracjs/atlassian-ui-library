import * as React from 'react';
import { shallow } from 'enzyme';
import { MockMentionResource } from '../../../../../util-data-test/src/mention/MockMentionResource';
import MentionList from '../../..//components/MentionList';
import ResourcedMentionList, {
  Props,
  mentionSpotlightLocalStorageKey,
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

  beforeEach(() => {
    localStorage.clear();
  });

  it('should show the highlight if conditions are just right', () => {
    const element = render({ mentionsSpotlightEnabled: true });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const spotlight = element.find(MentionList).props().initialHighlight;
    expect(spotlight).toBeDefined();
  });

  it('should not show the highlight if there are no users', () => {
    const element = render({ mentionsSpotlightEnabled: true });
    element.setState({ mentions: [] });

    const spotlight = element.find(MentionList).props().initialHighlight;
    expect(spotlight).toBeNull();
  });

  it('should not show the highlight if the spotlight flag is disabled', () => {
    const element = render({ mentionsSpotlightEnabled: false });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const spotlight = element.find(MentionList).props().initialHighlight;
    expect(spotlight).toBeNull();
  });

  it('should not show the highlight if the spotlight has been closed by the user', () => {
    const element = render({ mentionsSpotlightEnabled: true });
    element.setState({
      mentions: [{ id: 'someUser' }],
      highlightClosed: true,
    });

    const spotlight = element.find(MentionList).props().initialHighlight;
    expect(spotlight).toBeNull();
  });

  it('should not show the highlight if the user has opted out', () => {
    localStorage.setItem(mentionSpotlightLocalStorageKey, 'closed');
    const element = render({ mentionsSpotlightEnabled: true });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const spotlight = element.find(MentionList).props().initialHighlight;
    expect(spotlight).toBeNull();
  });

  it('should set a value in local storage when users closees', () => {
    const element = render({ mentionsSpotlightEnabled: true });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const spotlight = element.find(MentionList).props().initialHighlight;
    console.log('spotlight', spotlight);
    console.log('spotlight debug', spotlight.props);
    spotlight && spotlight.props.onClose();

    expect(localStorage.getItem(mentionSpotlightLocalStorageKey)).toEqual(
      'closed',
    );
  });
});
