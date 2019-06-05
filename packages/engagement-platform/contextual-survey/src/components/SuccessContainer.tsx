/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { colors } from '@atlaskit/theme';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';

interface Props {
  children: React.ReactNode;
}

export default ({ children }: Props) => (
  <section
    css={css`
      margin-left: 36px;
      margin-top: 8px;
    `}
  >
    <div
      css={css`
        position: absolute;
        top: 24px;
        left: 16px;
      `}
    >
      <CheckCircleIcon label="" aria-hidden primaryColor={colors.G300} />
    </div>
    {children}
  </section>
);
