import * as React from 'react';
import uuid from 'uuid/v4';

interface State {
  searchSessionId: string | undefined;
}

const SearchSessionContext = React.createContext<State>({
  searchSessionId: undefined,
});

export interface SearchSessionProps {
  searchSessionId: string;
}

/**
 * Wraps a component and provides the component with a searchSessionId.
 * The searchSessionId will either be retrieved from the closest SearchSessionProvider or a new one
 * will be generated with the wrapped component is mounted.
 */
export function injectSearchSession<T>(
  Component: React.ComponentType<T & SearchSessionProps>,
) {
  return (props: Pick<T, Exclude<keyof T, keyof SearchSessionProps>>) => (
    <SearchSessionContext.Consumer>
      {({ searchSessionId }) => (
        <Component
          {...props as T}
          searchSessionId={searchSessionId || uuid()}
        />
      )}
    </SearchSessionContext.Consumer>
  );
}

/**
 * A search session context provider.
 * This provides all children wrapped with injectSearchSession with the same search session id.
 * Noted a new search session id is generated if and only if this component is mounted.
 */
export default class SearchSessionProvider extends React.Component<{}, State> {
  state = {
    searchSessionId: uuid(),
  };

  render() {
    const { children } = this.props;
    const { searchSessionId } = this.state;

    return (
      <SearchSessionContext.Provider value={{ searchSessionId }}>
        {children}
      </SearchSessionContext.Provider>
    );
  }
}
