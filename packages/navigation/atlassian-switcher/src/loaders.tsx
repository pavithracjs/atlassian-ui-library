import Loadable from 'react-loadable';

export const loadAtlassianSwitcher = () =>
  import(/* webpackChunkName: "atlassian-switcher" */ './components/atlassian-switcher');

export const loadJiraSwitcher = () =>
  import(/* webpackChunkName: "jira-switcher" */ './components/jira-switcher');

export const loadConfluenceSwitcher = () =>
  import(/* webpackChunkName: "confluence-switcher" */ './components/confluence-switcher');

export const loadGenericSwitcher = () =>
  import(/* webpackChunkName: "generic-switcher" */ './components/generic-switcher');

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
