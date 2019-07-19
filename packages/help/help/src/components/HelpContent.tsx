import * as React from 'react';
import { withHelp, HelpContextInterface } from './HelpContext';
import Header from './Header';

import Search from './Search';
import ArticleComponent from './Article';

import { HelpBody } from './styled';

export interface Props {}

export const HelpContent = (props: Props & HelpContextInterface) => {
  const { help } = props;

  return (
    <>
      <Header />
      <HelpBody>
        {help.isSearchVisible() && <Search />}
        <ArticleComponent />
        {help.defaultContent}
      </HelpBody>
    </>
  );
};

export default withHelp(HelpContent);
