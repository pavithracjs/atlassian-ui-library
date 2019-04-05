import * as React from 'react';
import styled from 'styled-components';
import { EditorAppearance } from '../../types';

/**
 * @see ED-6102
 */

export function createMobileInlineDomRef() {
  const domRef = document.createElement('span');
  domRef.contentEditable = 'false';
  domRef.style.display = 'inline-block';
  return domRef;
}

export const MobileInlineWrapper: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.span`
  display: block;
`;

export interface Props {
  appearance?: EditorAppearance;
}

export const WrapInlineNodeForMobile: React.StatelessComponent<Props> = ({
  appearance,
  children,
}) =>
  appearance === 'mobile' ? (
    <MobileInlineWrapper>{children}</MobileInlineWrapper>
  ) : (
    <>{children}</>
  );
