import Loadable from 'react-loadable';

export const loadAtlassianSwitcher = () =>
  import(/* webpackChunkName: "@atlaskit/atlassian-switcher/async-chunk/atlassian-switcher" */ './components/atlassian-switcher');

export const loadJiraSwitcher = () =>
  import(/* webpackChunkName: "@atlaskit/atlassian-switcher/async-chunk/jira-switcher" */ './components/jira-switcher');

export const loadConfluenceSwitcher = () =>
  import(/* webpackChunkName: "@atlaskit/atlassian-switcher/async-chunk/confluence-switcher" */ './components/confluence-switcher');

export const loadGenericSwitcher = () =>
  import(/* webpackChunkName: "@atlaskit/atlassian-switcher/async-chunk/generic-switcher" */ './components/generic-switcher');

export const AtlassianSwitcherLoader = Loadable({
  loader: loadAtlassianSwitcher,
  loading: () => null,
});

export const JiraSwitcherLoader = Loadable({
  loader: loadJiraSwitcher,
  loading: () => null,
});

export const ConfluenceSwitcherLoader = Loadable({
  loader: loadConfluenceSwitcher,
  loading: () => null,
});

export const GenericSwitcherLoader = Loadable({
  loader: loadGenericSwitcher,
  loading: () => null,
});
