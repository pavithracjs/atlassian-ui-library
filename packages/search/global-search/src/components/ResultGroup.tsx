import * as React from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { ResultItemGroup } from '@atlaskit/quick-search';
import Badge from '@atlaskit/badge';

import { Result } from '../model/Result';
import ResultList from './ResultList';

export interface Props {
  title?: JSX.Element | string;
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
  showTotalSize: boolean;
  totalSize: number;
}

const TitlelessGroupWrapper = styled.div`
  margin-top: ${gridSize() * 1.5}px;
`;

const BadgeContainer = styled.span`
  margin-left: ${gridSize()}px;
`;

export default class ResultGroup extends React.Component<Props> {
  render() {
    const {
      title,
      results,
      sectionIndex,
      showTotalSize,
      totalSize,
    } = this.props;

    if (results.length === 0) {
      return null;
    }

    if (!title) {
      return (
        <TitlelessGroupWrapper>
          <ResultList
            analyticsData={this.props.analyticsData}
            results={results}
            sectionIndex={sectionIndex}
          />
        </TitlelessGroupWrapper>
      );
    }

    const titleView = showTotalSize ? (
      <>
        <span>{title}</span>
        <BadgeContainer>
          <Badge max={99}>{totalSize}</Badge>
        </BadgeContainer>
      </>
    ) : (
      <span>{title}</span>
    );

    return (
      <ResultItemGroup title={titleView}>
        <ResultList
          analyticsData={this.props.analyticsData}
          results={results}
          sectionIndex={sectionIndex}
        />
      </ResultItemGroup>
    );
  }
}
