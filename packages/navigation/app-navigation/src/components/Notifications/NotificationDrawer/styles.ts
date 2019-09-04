import { gridSize } from '@atlaskit/theme';

export const externalContent = (hasIframeLoaded: boolean) => ({
  visibility: hasIframeLoaded ? ('visible' as const) : ('hidden' as const),
  height: `calc(100% - ${3 * gridSize()}px)`,
  width: '100%',
  border: 0,
  flex: '1 1 auto',
});

export const spinnerWrapper = {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative' as const,
  top: '11.25rem',
};
