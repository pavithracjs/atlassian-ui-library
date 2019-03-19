import * as React from 'react';
import { messages } from '../../messages';
import { mountWithIntl } from '../helpers/_intl-enzyme-test-helper';

import {
  ShowMoreArticlesButton,
  Props as ShowMoreArticlesButtonProps,
} from '../../../components/Article/ShowMoreArticlesButton';
import { ReactWrapper } from 'enzyme';

const toggleRelatedArticlesMock = jest.fn();
const RenderShowMoreArticlesButton = (props: ShowMoreArticlesButtonProps) => {
  return;
};

describe('<Search />', () => {
  it('should pass through the linkComponent prop', () => {
    const wrapper = mountWithIntl(
      // @ts-ignore - doesn't recognise injected intl prop
      <ShowMoreArticlesButton
        showMoreToggeled={true}
        toggleRelatedArticles={toggleRelatedArticlesMock}
      />,
    );

    // console.log(wrapper);
  });
});
