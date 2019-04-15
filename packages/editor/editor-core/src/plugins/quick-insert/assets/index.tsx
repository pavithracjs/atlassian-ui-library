import Loadable from 'react-loadable';

export const IconAction = Loadable({
  loader: () => import('./action').then(module => module.default),
  loading: () => null,
});

export const IconCode = Loadable({
  loader: () => import('./code').then(module => module.default),
  loading: () => null,
});

export const IconDate = Loadable({
  loader: () => import('./date').then(module => module.default),
  loading: () => null,
});

export const IconDecision = Loadable({
  loader: () => import('./decision').then(module => module.default),
  loading: () => null,
});

export const IconDivider = Loadable({
  loader: () => import('./divider').then(module => module.default),
  loading: () => null,
});

export const IconEmoji = Loadable({
  loader: () => import('./emoji').then(module => module.default),
  loading: () => null,
});

export const IconImages = Loadable({
  loader: () => import('./images').then(module => module.default),
  loading: () => null,
});

export const IconLayout = Loadable({
  loader: () => import('./layout').then(module => module.default),
  loading: () => null,
});

export const IconLink = Loadable({
  loader: () => import('./link').then(module => module.default),
  loading: () => null,
});

export const IconListNumber = Loadable({
  loader: () => import('./list-number').then(module => module.default),
  loading: () => null,
});

export const IconList = Loadable({
  loader: () => import('./list').then(module => module.default),
  loading: () => null,
});

export const IconMention = Loadable({
  loader: () => import('./mention').then(module => module.default),
  loading: () => null,
});

export const IconPanelError = Loadable({
  loader: () => import('./panel-error').then(module => module.default),
  loading: () => null,
});

export const IconPanelNote = Loadable({
  loader: () => import('./panel-note').then(module => module.default),
  loading: () => null,
});

export const IconPanelSuccess = Loadable({
  loader: () => import('./panel-success').then(module => module.default),
  loading: () => null,
});

export const IconPanelWarning = Loadable({
  loader: () => import('./panel-warning').then(module => module.default),
  loading: () => null,
});

export const IconPanel = Loadable({
  loader: () => import('./panel').then(module => module.default),
  loading: () => null,
});

export const IconQuote = Loadable({
  loader: () => import('./quote').then(module => module.default),
  loading: () => null,
});

export const IconStatus = Loadable({
  loader: () => import('./status').then(module => module.default),
  loading: () => null,
});

export const IconTable = Loadable({
  loader: () => import('./table').then(module => module.default),
  loading: () => null,
});

export const IconFallback = Loadable({
  loader: () => import('./fallback').then(module => module.default),
  loading: () => null,
});
