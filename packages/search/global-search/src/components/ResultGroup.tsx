import * as React from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { Result } from '../model/Result';
import ResultList from './ResultList';

export interface Props {
  title?: JSX.Element | string;
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
}

const TitlelessGroupWrapper = styled.div`
  margin-top: ${gridSize() * 1.5}px;
`;

export default class ResultGroup extends React.Component<Props> {
  render() {
    const { title, results, sectionIndex } = this.props;

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

    return (
      <ResultItemGroup title={title}>
        <ResultList
          analyticsData={this.props.analyticsData}
          results={results}
          sectionIndex={sectionIndex}
        />
      </ResultItemGroup>
    );
  }
}
