import * as React from 'react';
import styled from 'styled-components';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import { colors } from '@atlaskit/theme';
import Loadable from '../../components/WrappedLoader';
import qs from 'query-string';

import packageResolver from '../../utils/packageResolver';
import * as fs from '../../utils/fs';
import { File } from '../../types';
import Loading from '../../components/Loading';
import {
  sendInitialApdex,
  initializeGA,
  observePerformanceMetrics,
} from '../../components/Analytics/GoogleAnalyticsListener';

const ErrorMessage = styled.div`
  background-color: ${colors.R400};
  color: white;
  font-size: 120%;
  padding: 1em;
`;

export type State = {
  packageId: string;
  groupId: string;
  exampleId: string;
  examplesPath: string | undefined;
  client: AnalyticsWebClient;
};

export type ExampleLoaderProps = {
  example: File;
  client: AnalyticsWebClient;
};

// Using console.debug instead of console.log to reduce noise.
// Chrome's default logging level excludes debug
const mockClient: AnalyticsWebClient = {
  sendUIEvent: e => console.debug('UI event', e),
  sendOperationalEvent: e => console.debug('Operational event', e),
  sendTrackEvent: e => console.debug('Track event', e),
  sendScreenEvent: e => console.debug('Screen event', e),
};

export default class ExamplesIFrame extends React.Component<{}, State> {
  state = {
    packageId: '',
    groupId: '',
    exampleId: '',
    examplesPath: undefined,
    client: mockClient,
  };

  async UNSAFE_componentWillMount() {
    if (window) {
      const { packageId, groupId, exampleId, examplesPath } = qs.parse(
        window.location.search,
      );
      this.setState({
        packageId,
        groupId,
        exampleId,
        examplesPath,
      });
    }

    if (ENABLE_ANALYTICS_GASV3) {
      try {
        const analyticsWebClientModule = await import(/*webpackChunkName: "@atlassiansox/analytics-web-client" */ '@atlassiansox/analytics-web-client');

        const {
          default: AnalyticsWebClient,
          originType,
          envType,
          platformType,
        } = analyticsWebClientModule;
        const analyticsWebClient = new AnalyticsWebClient({
          env: envType.DEV,
          product: 'atlaskit',
          origin: originType.WEB,
          platform: platformType.WEB,
          subproduct: 'website',
          user: '-',
          serverTime: Date.now(),
        });
        analyticsWebClient.startUIViewedEvent();
        this.setState({ client: analyticsWebClient });
      } catch (error) {
        console.log(`
You're running Atlaskit passing "ENABLE_ANALYTICS_GASV3=true" parameter.
You should install "@atlassiansox/analytics-web-client" locally without saving
in "package.json" nor "yarn.lock" files by running the command

1. Install "@atlassiansox/analytics-web-client" globally

yarn global add @atlassiansox/analytics-web-client

2. Link the package in website folder located in atlaskit repository

cd "$(yarn global dir)/node_modules/@atlassiansox/analytics-web-client" && yarn link

cd <your-atlaskit-folder>/website && yarn link "@atlassiansox/analytics-web-client"

3. Go back to the root folder of atlaskit repository, rerun the website again passing 'ENABLE_ANALYTICS_GASV3=true' as a prefix

cd <your-atlaskit-folder>
ENABLE_ANALYTICS_GASV3=true bolt <your-command>

${error}`);
      }
    }
  }

  componentDidMount() {
    if (window.self === window.top) {
      const location = window.location.pathname + window.location.search;
      window.addEventListener(
        'load',
        () => {
          sendInitialApdex(location);
        },
        { once: true },
      );
      observePerformanceMetrics(location);
    }

    initializeGA();
  }

  render() {
    const { example, packageId, exampleId } = packageResolver(
      this.state.groupId,
      this.state.packageId,
      this.state.exampleId,
      this.state.examplesPath,
    );
    if (example && exampleId) {
      return (
        <ExampleLoader example={example as File} client={this.state.client} />
      );
    }

    return (
      <ErrorMessage>
        {`${fs.titleize(packageId)} does not have an example built for '${
          this.state.exampleId
        }'`}
      </ErrorMessage>
    );
  }
}

export type Metadata = {
  meta?: {
    noListener?: boolean;
  };
};

export type Example = {
  default: React.ComponentType & Metadata;
};

function ExampleLoader(props: ExampleLoaderProps) {
  const ExampleComponent = Loadable({
    loader: () => props.example.exports(),
    loading: () => <Loading />,
    render(loaded: Example) {
      const ExampleComp = loaded.default;
      if (!ExampleComp) {
        return (
          <ErrorMessage>
            Example "{props.example.id}" doesn't have default export.
          </ErrorMessage>
        );
      }

      const meta = ExampleComp.meta || {};

      return meta.noListener ? (
        <ExampleComp />
      ) : (
        <FabricAnalyticsListeners client={props.client}>
          <ExampleComp />
        </FabricAnalyticsListeners>
      );
    },
  });

  return <ExampleComponent />;
}
