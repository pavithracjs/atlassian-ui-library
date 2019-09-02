/** @jsx jsx */
import SearchIcon from '@atlaskit/icon/glyph/search';
import { B50 } from '@atlaskit/theme/colors';
import { jsx, SerializedStyles } from '@emotion/core';
import { Fragment } from 'react';

import { IconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';

import { SearchInput, SearchWrapper, IconWrapper } from './styled';
import { searchIconStyles, searchInputStyles } from './styles';
import { SearchProps } from './types';

type SearchComponentProps = {
  css: SerializedStyles;
  onClick: SearchProps['onClick'];
  text: SearchProps['text'];
};

const SearchComponent = (props: SearchComponentProps) => {
  const { onClick, text, ...searchProps } = props;

  const onChange = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  return (
    <SearchWrapper {...searchProps}>
      <IconWrapper>
        <SearchIcon label={text} primaryColor={B50} />
      </IconWrapper>
      <SearchInput
        placeholder={text}
        onChange={onChange}
        onClick={onClick}
        value=""
      />
    </SearchWrapper>
  );
};

export const Search = (props: SearchProps) => {
  const { text, tooltip, ...triggerManagerProps } = props;

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <Fragment>
          <SearchComponent
            css={searchInputStyles}
            onClick={onTriggerClick}
            text={text}
          />
          <IconButton
            css={searchIconStyles}
            icon={<SearchIcon label={tooltip} />}
            onClick={onTriggerClick}
            tooltip={tooltip}
          />
        </Fragment>
      )}
    </TriggerManager>
  );
};
