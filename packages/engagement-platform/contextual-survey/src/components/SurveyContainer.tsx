/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import { layers, elevation, borderRadius } from '@atlaskit/theme';
import { colors, gridSize } from '@atlaskit/theme';
import CrossIcon from '@atlaskit/icon/glyph/cross';

interface Props {
  children: React.ReactNode;
  onDismiss: () => void;
}

export const surveyWidth = gridSize() * 55; // 440
export const surveyMargin = gridSize() * 6; // 48

export default ({ children, onDismiss }: Props) => {
  return (
    <div
      css={css`
        background-color: ${colors.N0};
        position: fixed;
        bottom: ${surveyMargin}px;
        right: ${surveyMargin}px;
        width: ${surveyWidth}px;
        z-index: ${layers.flag()};
        ${elevation.e500()}
        border-radius: ${borderRadius()}px;
        padding: ${gridSize() * 3}px;
      `}
    >
      <div
        css={css`
          position: absolute;
          top: ${gridSize() * 2}px;
          right: ${gridSize() * 2}px;
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
