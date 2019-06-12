import React, { useRef, useState } from 'react';
import Inline from './inline';
import styled from 'styled-components';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import Tooltip from '@atlaskit/tooltip';
import { colors } from '@atlaskit/theme';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import messages from '../../messages';
import { headingSizes } from '@atlaskit/editor-common';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const CopyAnchorWrapper = styled.span`
  display: inline-flex;
  position: absolute;
  width: 0;
  align-items: center;
  overflow: visible;
`;

const COPY_ICON_HEIGHT = 20;

const CopyAnchor = styled.a`
  align-items: center;
  background-color: white;
  border-radius: 4px;
  color: ${colors.N50};
  cursor: pointer;
  display: flex;
  top: 0;
  position: absolute;
  right: 0;
  height: ${COPY_ICON_HEIGHT}px;
  width: ${COPY_ICON_HEIGHT}px;
`;

const CopyArea = styled.textarea`
  background-color: transparent;
  border: none;
  height: 1px;
  outline: none;
  overflow: hidden;
  padding: 0;
  position: absolute;
  resize: none;
  top: 10px;
  right: 10px;
  width: 1px;

  ::selection {
    background-color: transparent;
    color: white;
  }
`;

function Heading(
  props: {
    level: HeadingLevel;
    headingId?: string;
    showAnchorLink?: boolean;
    isTopLevelHeading?: boolean;
  } & InjectedIntlProps &
    React.Props<any>,
) {
  const {
    level,
    children,
    headingId,
    showAnchorLink,
    intl: { formatMessage },
  } = props;
  const HX = `h${level}`;
  const [copySuccess, setCopySuccess] = useState(
    formatMessage(messages.copyHeadingLinkToClipboard),
  );
  const [isHover, setIsHover] = useState(true);

  const textAreaRef = useRef<HTMLInputElement>(null);

  function copyToClipboard() {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.select();
      const wasCopied = document.execCommand('copy');
      if (wasCopied) {
        // Need to rerender the tooltip to reposition it
        setCopySuccess('');
        setTimeout(() => {
          setCopySuccess(formatMessage(messages.copiedHeadingLinkToClipboard));
        }, 0);
      }
    }
  }

  const HX_PROPS = showAnchorLink
    ? {
        onMouseEnter: () => setIsHover(true),
        onMouseLeave: () => {
          setIsHover(false);
          setCopySuccess(formatMessage(messages.copyHeadingLinkToClipboard));
        },
      }
    : {};

  return (
    <HX id={headingId} {...HX_PROPS}>
      {showAnchorLink && isHover && headingId && (
        <CopyAnchorWrapper
          style={{
            height: `${headingSizes[HX]['lineHeight']}em`,
          }}
        >
          <CopyAnchor className="copy-anchor" onClick={copyToClipboard}>
            {copySuccess ? (
              <Tooltip content={copySuccess} position="top">
                <CopyIcon label="copy" size="small" />
              </Tooltip>
            ) : (
              <div>
                <CopyIcon label="copy" size="small" />
              </div>
            )}
          </CopyAnchor>
          <CopyArea
            innerRef={textAreaRef}
            readOnly
            defaultValue={`${document.location &&
              document.location.protocol}//${location.host}${
              location.pathname
            }${location.search}#${encodeURIComponent(headingId)}`}
          />
        </CopyAnchorWrapper>
      )}
      <Inline>{children}</Inline>
    </HX>
  );
}

export default injectIntl(Heading);
