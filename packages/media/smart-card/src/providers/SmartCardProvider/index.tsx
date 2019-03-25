import * as React from 'react';
import Context from '../SmartCardContext';
import { Client } from '../../client';

export interface ProviderProps {
  client?: Client;
  children: React.ReactElement<any>;
}

const defaultClient: Client = new Client();

export class Provider extends React.Component<ProviderProps> {
  render() {
    const { client, children } = this.props;

    // Note: the provider is also a consumer which passes through a client from
    // parent context in case a Card is wrapped with multiple Providers.
    return (
      <Context.Consumer>
        {clientFromParentContext => (
          <Context.Provider
            value={client || clientFromParentContext || defaultClient}
          >
            {children}
          </Context.Provider>
        )}
      </Context.Consumer>
    );
  }
}
