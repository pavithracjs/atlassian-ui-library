import * as React from 'react';
import StorybookQuickSearch from '../example-helpers/StorybookQuickSearch';

export default class GlobalQuickSearchExample extends React.Component {
  render() {
    return (
      <StorybookQuickSearch
        experimentId="search-extensions-simple"
        fasterSearchFFEnabled={false} // Faster search doesn't work with simple experiments
      />
    );
  }
}
