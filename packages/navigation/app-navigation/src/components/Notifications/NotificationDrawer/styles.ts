import { gridSize } from '@atlaskit/theme';
import { CSSObject } from '@emotion/css';

const externalContent = (hasIframeLoaded: boolean): CSSObject => ({
  visibility: hasIframeLoaded ? 'visible' : 'hidden',
  height: `calc(100% - ${3 * gridSize()}px)`,
  width: '100%',
  border: 0,
  flex: '1 1 auto',
});

const spinnerWrapper: CSSObject = {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  top: '11.25rem',
};

export { externalContent, spinnerWrapper };
