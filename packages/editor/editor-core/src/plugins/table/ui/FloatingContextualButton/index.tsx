import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Popup } from '@atlaskit/editor-common';
import { findDomRefAtPos } from 'prosemirror-utils';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { tableFloatingCellButtonStyles } from '../styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { TableCssClassName as ClassName } from '../../types';
import messages from '../../ui/messages';
import { toggleContextualMenu } from '../../commands';
import { closestElement } from '../../../../utils';

export interface Props {
  editorView: EditorView;
  targetCellPosition: number;
  isContextualMenuOpen?: boolean;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
}

const ButtonWrapper = styled.div`
  ${tableFloatingCellButtonStyles}
`;

const FloatingContextualButton = ({
  mountPoint,
  scrollableElement,
  editorView,
  targetCellPosition,
  isContextualMenuOpen,
  intl: { formatMessage },
}: Props & InjectedIntlProps) => {
  const { state, dispatch } = editorView;
  const domAtPos = editorView.domAtPos.bind(editorView);
  const targetCellRef = findDomRefAtPos(targetCellPosition, domAtPos);
  if (!targetCellRef || !(targetCellRef instanceof HTMLElement)) {
    return null;
  }

  const handleClick = () => {
    toggleContextualMenu()(state, dispatch);
  };
  const tableWrapper = closestElement(
    targetCellRef,
    `.${ClassName.TABLE_NODE_WRAPPER}`,
  );

  const labelCellOptions = formatMessage(messages.cellOptions);
  return (
    <Popup
      alignX="right"
      alignY="start"
      target={targetCellRef}
      mountTo={tableWrapper || mountPoint}
      boundariesElement={targetCellRef}
      scrollableElement={scrollableElement}
      forcePlacement={true}
      offset={[3, -3]}
    >
      <ButtonWrapper>
        <ToolbarButton
          className={ClassName.CONTEXTUAL_MENU_BUTTON}
          selected={isContextualMenuOpen}
          title={labelCellOptions}
          onClick={handleClick}
          iconBefore={<ExpandIcon label={labelCellOptions} />}
        />
      </ButtonWrapper>
    </Popup>
  );
};

export default injectIntl(FloatingContextualButton);
