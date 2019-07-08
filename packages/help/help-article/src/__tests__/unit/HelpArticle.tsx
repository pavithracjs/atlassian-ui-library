/* eslint-disable no-undef, import/no-extraneous-dependencies */
import React from 'react';
import { mount, shallow } from 'enzyme';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import HelpArticle from '../../components/HelpArticle';
import { ArticleContentTitleLink } from '../../components/styled';

describe('HelpArticle', () => {
  const TITLE = 'title content';
  const BODY = 'body content';
  const TITLE_LINK_URL = 'https://atlaskit.atlassian.com/';

  describe('with defined Title', () => {
    it('should render title', () => {
      const helpArticle = shallow(<HelpArticle title={TITLE} />);
      const title = helpArticle.find('h2').first();
      expect(title.text()).toEqual(TITLE);
    });

    it('should render body', () => {
      const helpArticle = mount(<HelpArticle body={BODY} />);
      const body = helpArticle.find('.content-platform-support').first();
      expect(body.text()).toEqual(BODY);
    });

    it('should render title with link', () => {
      const helpArticle = shallow(
        <HelpArticle title={TITLE} titleLinkUrl={TITLE_LINK_URL} />,
      );

      const titleLink = helpArticle.find(ArticleContentTitleLink).first();
      expect(titleLink.find(ShortcutIcon).length).toEqual(1);
      expect(titleLink.prop('href')).toEqual(TITLE_LINK_URL);
      expect(titleLink.text()).toContain(TITLE);
    });
  });
});
