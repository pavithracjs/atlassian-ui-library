import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Card, Client, Provider, ResolveResponse } from '..';

class UnAuthCustomClient extends Client {
  constructor() {
    super();
  }
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        access: 'unauthorized',
        visibility: 'restricted',
        definitionId: 'd1',
        auth: [],
      },
    } as ResolveResponse);
  }
}

class ErroringCustomClient extends Client {
  constructor() {
    super();
  }
  fetchData(url: string): Promise<ResolveResponse> {
    return Promise.reject(`Can't resolve from ${url}`);
  }
}

const unAuthClient = new UnAuthCustomClient();
const erroringClient = new ErroringCustomClient();

class Example extends React.Component {
  render() {
    return (
      <Page>
        <Grid>
          <GridColumn>
            <h4>Unauthorized response</h4>
            <Provider
              client={unAuthClient}
              cacheOptions={{ maxLoadingDelay: 1000, maxAge: 15000 }}
            >
              <Card url="http://some.unauth.url" appearance="inline" />
            </Provider>
            <hr />
            <h4>Error response</h4>
            <Provider
              client={erroringClient}
              cacheOptions={{ maxLoadingDelay: 1000, maxAge: 15000 }}
            >
              <Card url="http://some.error.url" appearance="inline" />
            </Provider>
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}

export default () => <Example />;
