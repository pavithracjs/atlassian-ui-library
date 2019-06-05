/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import { layers, elevation, borderRadius } from '@atlaskit/theme';
import { colors } from '@atlaskit/theme';
import CrossIcon from '@atlaskit/icon/glyph/cross';

interface Props {
  children: React.ReactNode;
  onDismiss: () => void;
}

export const surveyWidth = 440;
export const surveyMargin = 48;

export default ({ children, onDismiss }: Props) => {
  return (
    <div
      css={css`
    position: fixed;
    bottom: ${surveyMargin}px;
    right: ${surveyMargin}px;
    width: ${surveyWidth}px;
    z-index: ${layers.flag()};
    ${elevation.e500()}
    border-radius: ${borderRadius()}px;
    padding: 20px;
  `}
    >
      <div
        css={css`
          margin-top: -8px;
          margin-right: -8px;
          float: right;
        `}
      >
        <Button
          iconBefore={<CrossIcon primaryColor={colors.N50} label="Dismiss" />}
          appearance="subtle"
          onClick={onDismiss}
        />
      </div>
      {children}
    </div>
  );
};
