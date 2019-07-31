import React, { Node } from 'react';
import Lozenge from '@atlaskit/lozenge';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import {
  BulletSpacer,
  Restricted,
  RestrictedIconWrapper,
  TopItem,
  TopItemsContainer,
} from '../styled/HeaderStyles';

interface Props {
  author?: Node,
  restrictedTo?: Node,
  isSaving?: boolean,
  savingText?: string,
  time?: Node,
  interface?: string,
  edited?: Node,
  isError?: boolean,
};

const HeaderItems = ({
  author,
  edited,
  isError,
  isSaving,
  restrictedTo,
  savingText,
  time,
  interface,
}: Props) => {
  const restrictedElement = restrictedTo ? (
    <Restricted>
      <BulletSpacer>&bull;</BulletSpacer>
      <RestrictedIconWrapper>
        <LockFilledIcon size="small" />
      </RestrictedIconWrapper>{' '}
      {restrictedTo}
    </Restricted>
  ) : null;

  const items = [
    author || null,
    interface ? <Lozenge>{interface}</Lozenge> : null,
    time && !isSaving && !isError ? time : null,
    edited || null,
    isSaving ? savingText : null,
    restrictedElement,
  ]
    .filter(item => !!item)
    .map((item, index) => <TopItem key={index}>{item}</TopItem>); // eslint-disable-line react/no-array-index-key

  return items.length ? <TopItemsContainer>{items}</TopItemsContainer> : null;
};

export default HeaderItems;
