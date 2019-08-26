import * as React from 'react';
import { AkCustomDrawer } from '@atlaskit/navigation';

import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import DefaultNav from './navigations/Default';

import { AtlaskitIcon } from '../../components/AtlaskitIcon';

export type Props = {
  closeDrawer: (e: React.MouseEvent<HTMLElement>) => void;
  isOpen: boolean;
  pathname: string;
};

const GroupDrawer: React.StatelessComponent<Props> = ({
  closeDrawer,
  isOpen,
  pathname,
}: Props) => (
  <AkCustomDrawer
    backIcon={<ArrowLeftIcon label="go back" />}
    isOpen={isOpen}
    key="groups"
    onBackButton={closeDrawer}
    primaryIcon={<AtlaskitIcon monochrome />}
  >
    <DefaultNav onClick={closeDrawer} pathname={pathname} />
  </AkCustomDrawer>
);

export default GroupDrawer;
