import * as React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: This component is designed for internal Atlassian development.
      </strong>
    </p>
    <p>
      External contributors will be able to use this component but will not be
      able to submit issues.
    </p>
  </SectionMessage>
)}
  This is a barebones quick-search component that can render different types of search results.
  
  ## Usage
  ${code`import { QuickSearch, ObjectResult, ContainerResult, ResultItemGroup } from '@atlaskit/quick-search';

  // Inside a react component with proper state and stuff.. :
  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={({ target }) => { this.search(target.value); }}
        value={this.state.query}
      >
        // render search results:
        <ResultItemGroup title="Issues">
          <ObjectResult name="Fix this and that" objectKey="JRA-123" /> 
          <ObjectResult name="More stuff" objectKey="JRA-124" /> 
        </ResultItemGroup>
        <ResultItemGroup title="Spaces">
          <ContainerResult name="Search and Smarts" /> 
        </ResultItemGroup>
      </QuickSearch>
    );
  }
  `}

  ${(
    <Example
      Component={require('../examples/1-Object-Results').default}
      title="Objects"
      source={require('!!raw-loader!../examples/1-Object-Results')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/QuickSearch')}
    />
  )}

`;
