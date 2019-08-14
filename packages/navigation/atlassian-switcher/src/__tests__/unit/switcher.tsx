import * as React from 'react';
import { shallow } from 'enzyme';
import Switcher from '../../components/switcher';
import messages from '../../utils/messages';

const noop = () => void 0;

describe('Switcher', () => {
  it('should render sections with headers by default', () => {
    expect(
      shallow(
        <Switcher
          messages={messages}
          triggerXFlow={noop}
          hasLoaded
          hasLoadedCritical
          onDiscoverMoreClicked={noop}
          licensedProductLinks={[]}
          suggestedProductLinks={[]}
          fixedLinks={[]}
          adminLinks={[]}
          recentLinks={[]}
          customLinks={[]}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('should be able to disable headers with "disableHeadings"', () => {
    expect(
      shallow(
        <Switcher
          messages={messages}
          triggerXFlow={noop}
          hasLoaded
          hasLoadedCritical
          onDiscoverMoreClicked={noop}
          licensedProductLinks={[]}
          suggestedProductLinks={[]}
          fixedLinks={[]}
          adminLinks={[]}
          recentLinks={[]}
          customLinks={[]}
          disableHeadings
        />,
      ),
    ).toMatchSnapshot();
  });
});
