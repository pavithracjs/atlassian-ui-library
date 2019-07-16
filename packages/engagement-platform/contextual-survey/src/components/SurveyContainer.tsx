/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import { elevation, borderRadius, colors, gridSize } from '@atlaskit/theme';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { surveyInnerWidth } from '../constants';

interface Props {
  children: React.ReactNode;
  onDismiss: () => void;
}

const padding: number = gridSize() * 3;

export default ({ children, onDismiss }: Props) => {
  return (
    <div
      css={css`
        background-color: ${colors.N0};
        border-radius: ${borderRadius()}px;
        padding: ${padding}px;
        ${elevation.e500()}
        width: ${surveyInnerWidth}px;
      `}
    >
      <div
        css={css`
          position: absolute;
          top: ${padding - gridSize()}px;
          right: ${padding - gridSize()}px;
        `}
      >
        <Button
          iconBefore={<CrossIcon label="" primaryColor={colors.N50} />}
          aria-label="Dismiss"
          appearance="subtle"
          onClick={onDismiss}
        />
      </div>
      {children}
    </div>
  );
};
