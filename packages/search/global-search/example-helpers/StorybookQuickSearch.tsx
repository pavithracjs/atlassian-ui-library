import * as React from 'react';
import BasicNavigation from './components/BasicNavigation';
import LocaleIntlProvider from './components/LocaleIntlProvider';
import { QuickSearchContext } from '../src/api/types';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { DrawerItemTheme } from '@atlaskit/drawer';
import {
  DefaultQuickSearchWrapper,
  PartialProps,
} from './components/DefaultQuickSearchWrapper';
import { RadioGroup, RadioWithLabel } from './components/RadioWithLabel';
import { setupMocks, teardownMocks, MocksConfig } from './mocks/mockApis';
import {
  MessageContainer,
  TogglesAndMessagePanel,
} from './components/ToggleAndMessageContainer';

const availableContext = ['jira', 'confluence'];
const presetConfig = {
  local: {
    // This one is special in that it will setup mocks, see #handleConfigChange below
  },
  jdog: {
    cloudId: '497ea592-beb4-43c3-9137-a6e5fa301088',
    activityServiceUrl: 'https://api-private.stg.atlassian.com/activity',
    searchAggregatorServiceUrl:
      'https://api-private.stg.atlassian.com/xpsearch-aggregator',
    directoryServiceUrl: 'https://api-private.stg.atlassian.com/directory',
  },
  pug: {
    cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
    activityServiceUrl: 'https://api-private.stg.atlassian.com/activity',
    searchAggregatorServiceUrl:
      'https://api-private.stg.atlassian.com/xpsearch-aggregator',
    directoryServiceUrl: 'https://api-private.stg.atlassian.com/directory',
  },
};

export interface Config {
  message?: JSX.Element;
  experimentId?: string;
}

interface State {
  context: QuickSearchContext;
  locale: string;
  currentConfig: string;
}

export default class WithNavigation extends React.Component<
  Partial<PartialProps> & Config,
  State
> {
  state = {
    context: 'confluence' as QuickSearchContext,
    locale: 'en',
    currentConfig: 'local',
    toggleRequestSpeedSettings: 'fast',
  };

  setupMocks() {
    const mockConfig: Partial<MocksConfig> = {};

    if (this.props.experimentId) {
      mockConfig.abTestExperimentId = this.props.experimentId;
    }

    setupMocks(mockConfig);
  }

  componentWillMount() {
    this.setupMocks();
  }

  componentWillUnmount() {
    if (this.state.currentConfig === 'local') {
      teardownMocks();
    }
  }

  handleContextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ('jira' === e.target.value || 'confluence' === e.target.value) {
      this.setState({
        context: e.target.value,
      });
    }
  };

  renderContextGroup() {
    return (
      <RadioGroup>
        <b>Context:</b>
        {availableContext.map(context => (
          <RadioWithLabel
            key={context}
            value={context}
            checked={context === this.state.context}
            onChange={this.handleContextChange}
          >
            {context.charAt(0).toUpperCase() + context.slice(1)}
          </RadioWithLabel>
        ))}
      </RadioGroup>
    );
  }

  renderLocaleRadioGroup() {
    const { locale } = this.state;

    return (
      <RadioGroup>
        <b>Locale:</b>
        <RadioWithLabel
          value="en"
          checked={locale === 'en'}
          onChange={this.handleLocaleChange}
        >
          EN
        </RadioWithLabel>
        <RadioWithLabel
          value="es"
          checked={locale === 'es'}
          onChange={this.handleLocaleChange}
        >
          ES
        </RadioWithLabel>
        <RadioWithLabel
          value="pt-BR"
          checked={locale === 'pt-BR'}
          onChange={this.handleLocaleChange}
        >
          pt-BR
        </RadioWithLabel>
        <RadioWithLabel
          value="zh"
          checked={locale === 'zh'}
          onChange={this.handleLocaleChange}
        >
          ZH
        </RadioWithLabel>
      </RadioGroup>
    );
  }

  handleLocaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      locale: e.target.value,
    });
  };

  renderInstanceTargetGroup() {
    return (
      <RadioGroup>
        <b>Connect to:</b>
        {Object.keys(presetConfig).map(key => {
          return (
            <RadioWithLabel
              key={`config_${key}`}
              value={key}
              checked={key === this.state.currentConfig}
              onChange={this.handleConfigChange}
            >
              {key}
            </RadioWithLabel>
          );
        })}
        {this.state.currentConfig !== 'local' && (
          <p>
            Not getting results?
            <br />
            Try logging in{' '}
            <a href="https://id.stg.internal.atlassian.com" target="_blank">
              here
            </a>
          </p>
        )}
      </RadioGroup>
    );
  }

  handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'local' && this.state.currentConfig !== 'local') {
      this.setupMocks();
    } else if (
      e.target.value !== 'local' &&
      this.state.currentConfig === 'local'
    ) {
      teardownMocks();
    }

    this.setState({
      currentConfig: e.target.value,
    });
  };

  renderAnalyticsHint() {
    return (
      <p>
        <b>Analytics</b>
        <br />
        1. Open Chrome console
        <br />
        2. Filter with <b>event</b>
      </p>
    );
  }

  renderMessage() {
    const { message } = this.props;
    if (!message) {
      return null;
    }
    return <MessageContainer>{message}</MessageContainer>;
  }

  renderNavigation = () => {
    const { context: currentContext, locale } = this.state;

    return (
      <BasicNavigation
        searchDrawerContent={() => (
          <LocaleIntlProvider locale={locale}>
            <DefaultQuickSearchWrapper
              context={currentContext}
              //@ts-ignore
              {...presetConfig[this.state.currentConfig] || {}}
              {...this.props}
            />
          </LocaleIntlProvider>
        )}
      />
    );
  };

  render() {
    return (
      <DrawerItemTheme>
        <NavigationProvider>
          <LayoutManager
            productNavigation={() => null}
            containerNavigation={() => null}
            globalNavigation={this.renderNavigation}
          >
            <TogglesAndMessagePanel>
              {/* Render storybook specific messages */}
              {this.renderMessage()}
              {/* Render radio for changing product */}
              {this.renderContextGroup()}
              {/* Render radio for changing locale */}
              {this.renderLocaleRadioGroup()}
              {/* Render radio for targetting different live instances */}
              {this.renderInstanceTargetGroup()}
              {/* Render hint for users to see analytics */}
              {this.renderAnalyticsHint()}
            </TogglesAndMessagePanel>
          </LayoutManager>
        </NavigationProvider>
      </DrawerItemTheme>
    );
  }
}