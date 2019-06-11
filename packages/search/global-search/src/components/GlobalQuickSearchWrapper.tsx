import * as React from 'react';
import { CancelableEvent } from '@atlaskit/quick-search';
import HomeQuickSearchContainer from './home/HomeQuickSearchContainer';
import ConfluenceQuickSearchContainer from './confluence/ConfluenceQuickSearchContainer';
import JiraQuickSearchContainer from './jira/JiraQuickSearchContainer';
import configureSearchClients, {
  Config,
  SearchClients,
} from '../api/configureSearchClients';
import MessagesIntlProvider from './MessagesIntlProvider';
import { GlobalSearchPreFetchContext } from './PrefetchedResultsProvider';
import {
  QuickSearchContext,
  ConfluenceModelContext,
  JiraModelContext,
} from '../api/types';
import { createFeatures } from '../util/features';
import { ABTest } from '../api/CrossProductSearchClient';
import { ABTestProvider } from './AbTestProvider';
import withFeedbackButton, {
  FeedbackCollectorProps,
} from './feedback/withFeedbackButton';

const DEFAULT_NOOP_LOGGER: Logger = {
  safeInfo() {},
  safeWarn() {},
  safeError() {},
};

export type LinkComponent = React.ComponentType<{
  className: string;
  children: React.ReactNode;
  href?: string;
  target?: string;
}>;

export type Logger = {
  safeInfo(message?: any, ...optionalParams: any[]): void;
  safeWarn(message?: any, ...optionalParams: any[]): void;
  safeError(message?: any, ...optionalParams: any[]): void;
};

export type ReferralContextIdentifiers = {
  searchReferrerId: string;
  currentContentId: string;
  currentContainerId?: string;
};

export type JiraApplicationPermission = {
  hasCoreAccess: boolean;
  hasSoftwareAccess: boolean;
  hasServiceDeskAccess: boolean;
  hasOpsAccess: boolean;
};

export type AdvancedSearchEvent = {
  /**
   * prevent navigation to advanced search page
   */
  preventDefault: () => void;
  /**
   * query entered by user
   */
  query: string;
  /**
   * if it is jira it can be one of the following ['issues', 'boards', 'projects', 'filters', 'people']
   * if it is confluence it can be one of the following ['content', 'people']
   */
  category: string;
  /**
   * orignial event, this is useful when need to check if the click was to open in new tab or in same tab
   * but if consumer wanna cancel the event {@link preventDefault} should be used
   */
  originalEvent: object;
  /**
   * searchSessionId from the quick search session, it should be used for the advanced search session
   */
  searchSessionId: string;
};
export interface Props {
  /**
   * The cloudId of the site the component is embedded in.
   */
  cloudId: string;

  /**
   * The context for quick-search determines the UX and what kind of entities the component is searching.
   */
  context: QuickSearchContext;

  /**
   * For development purposes only: Overrides the URL to the activity service.
   */
  activityServiceUrl?: string;

  /**
   * For development purposes only: Overrides the URL to the search aggregator service.
   */
  searchAggregatorServiceUrl?: string;

  /**
   * For development purposes only: Overrides the URL to the directory service.
   */
  directoryServiceUrl?: string;

  /**
   * The URL for Confluence. Must include the context path.
   */
  confluenceUrl?: string;

  /**
   * The URL for Jira. Must include the context path.
   */
  jiraUrl?: string;

  /**
   * React component to be used for rendering links. It receives a className prop that needs to be applied for
   * proper styling, a children prop that needs to be rendered, and optional href/target props that should be
   * respected.
   */
  linkComponent?: LinkComponent;

  /**
   * An object containing referral IDs, i.e. the searchReferrerId and currentContentId.
   */
  referralContextIdentifiers?: ReferralContextIdentifiers;

  /**
   * Indicates whether to disable Jira people search on the pre-query screen
   */
  disableJiraPreQueryPeopleSearch?: boolean;

  /**
   * logger with 3 levels error, warn and info
   */
  logger?: Logger;

  /**
   * call back, to be called when advanced search is clicked
   */
  onAdvancedSearch?: (e: AdvancedSearchEvent) => void;

  /**
   * controls where to retrieve prequery results either from aggregator or directly from the product
   */
  enablePreQueryFromAggregator?: boolean;

  /**
   * A prop to provide additional elements to render on the right of the search bar, e.g. the feedback button.
   */
  inputControls?: JSX.Element;

  /*
   * detemrine jira application permission like software or servicedesk acess
   * optional because it is passed only for jira
   */
  appPermission?: JiraApplicationPermission;

  /**
   * Determine whether to enable faster search for control (aka 'default').
   * This is used for Confluence only.
   */
  fasterSearchFFEnabled?: boolean;

  /**
   * Determine whether to enable urs for bootstrapping people search.
   */
  useUrsForBootstrapping?: boolean;

  /**
   * Additional context paramters used to evaluate search models
   */
  modelContext?: ConfluenceModelContext | JiraModelContext;

  /**
   * Determines whether or not to show a feedback collector
   */
  showFeedbackCollector?: boolean;

  /**
   * Props to pass down to the feedback collector
   */
  feedbackCollectorProps?: FeedbackCollectorProps;
}

/**
 * Component that exposes the public API for global quick search. Its only purpose is to offer a simple, user-friendly API to the outside and hide the implementation detail of search clients etc.
 */
export default class GlobalQuickSearchWrapper extends React.Component<Props> {
  static defaultProps = {
    logger: DEFAULT_NOOP_LOGGER,
  };

  private makeConfig() {
    const config: Partial<Config> = {};
    const {
      activityServiceUrl,
      searchAggregatorServiceUrl,
      directoryServiceUrl,
      confluenceUrl,
    } = this.props;

    if (activityServiceUrl) {
      config.activityServiceUrl = activityServiceUrl;
    }

    if (searchAggregatorServiceUrl) {
      config.searchAggregatorServiceUrl = searchAggregatorServiceUrl;
    }

    if (directoryServiceUrl) {
      config.directoryServiceUrl = directoryServiceUrl;
    }

    if (confluenceUrl) {
      config.confluenceUrl = confluenceUrl;
    }

    return config;
  }

  shouldComponentUpdate(nextProps: Props, nextState: any) {
    return (
      (Object.keys({ ...nextProps, ...this.props }) as Array<keyof Props>)
        .map(key => this.props[key] !== nextProps[key])
        .reduce((acc, value) => acc || value, false) || this.state !== nextState
    );
  }

  onAdvancedSearch = (
    e: CancelableEvent,
    entity: string,
    query: string,
    searchSessionId: string,
  ) => {
    if (this.props.onAdvancedSearch) {
      let preventEventDefault = false;
      this.props.onAdvancedSearch({
        preventDefault: () => (preventEventDefault = true),
        query, // query entered by the user
        category: entity,
        originalEvent: e,
        searchSessionId,
      });

      if (preventEventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  renderSearchContainer(searchClients: SearchClients, abTest: ABTest) {
    const {
      linkComponent,
      referralContextIdentifiers,
      logger,
      disableJiraPreQueryPeopleSearch,
      enablePreQueryFromAggregator,
      inputControls,
      appPermission,
      fasterSearchFFEnabled,
      useUrsForBootstrapping,
      modelContext,
      showFeedbackCollector,
      feedbackCollectorProps,
    } = this.props;

    const commonProps = {
      ...searchClients,
      features: createFeatures({
        abTest,
        fasterSearchFFEnabled: !!fasterSearchFFEnabled,
        useUrsForBootstrapping: !!useUrsForBootstrapping,
        disableJiraPreQueryPeopleSearch: !!disableJiraPreQueryPeopleSearch,
        enablePreQueryFromAggregator: !!enablePreQueryFromAggregator,
      }),
      linkComponent: linkComponent,
      referralContextIdentifiers: referralContextIdentifiers,
      logger: logger || DEFAULT_NOOP_LOGGER,
      onAdvancedSearch: this.onAdvancedSearch,
    };

    if (this.props.context === 'confluence') {
      const Container = showFeedbackCollector
        ? withFeedbackButton(ConfluenceQuickSearchContainer)
        : ConfluenceQuickSearchContainer;
      return (
        <Container
          {...commonProps}
          {...feedbackCollectorProps}
          modelContext={modelContext}
          firePrivateAnalyticsEvent={undefined}
          createAnalyticsEvent={undefined}
          inputControls={inputControls}
        />
      );
    } else if (this.props.context === 'home') {
      return <HomeQuickSearchContainer {...commonProps} />;
    } else if (this.props.context === 'jira') {
      return (
        <JiraQuickSearchContainer
          {...commonProps}
          appPermission={appPermission}
        />
      );
    } else {
      // fallback to home if nothing specified
      return <HomeQuickSearchContainer {...commonProps} />;
    }
  }

  render() {
    return (
      <MessagesIntlProvider>
        <GlobalSearchPreFetchContext.Consumer>
          {prefetchedResults => {
            const searchClients = configureSearchClients(
              this.props.cloudId,
              this.makeConfig(),
              prefetchedResults,
            );

            const { context } = this.props;

            return (
              <ABTestProvider
                context={context}
                crossProductSearchClient={
                  searchClients.crossProductSearchClient
                }
              >
                {abTest => this.renderSearchContainer(searchClients, abTest)}
              </ABTestProvider>
            );
          }}
        </GlobalSearchPreFetchContext.Consumer>
      </MessagesIntlProvider>
    );
  }
}
