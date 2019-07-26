import React from 'react';
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
};

export type ExampleLoaderProps = {
  example: File;
};

export default class ExamplesIFrame extends React.Component<{}, State> {
  state = {
    packageId: '',
    groupId: '',
    exampleId: '',
    examplesPath: undefined,
  };
  componentWillMount() {
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
      return <ExampleLoader example={example as File} />;
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

// Using console.debug instead of console.log to reduce noise.
// Chrome's default logging level excludes debug
const mockClient: AnalyticsWebClient = {
  sendUIEvent: e => console.debug('UI event', e),
  sendOperationalEvent: e => console.debug('Operational event', e),
  sendTrackEvent: e => console.debug('Track event', e),
  sendScreenEvent: e => console.debug('Screen event', e),
};

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
        <FabricAnalyticsListeners client={mockClient}>
          <ExampleComp />
        </FabricAnalyticsListeners>
      );
    },
  });

  return <ExampleComponent />;
}
