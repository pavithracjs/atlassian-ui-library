import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Tooltip from '@atlaskit/tooltip';
import MobileHeader from '@atlaskit/mobile-header';
import Navigation, { AkContainerTitle } from '@atlaskit/navigation';

import Groups from './Groups';
import { AtlaskitIcon } from '../../components/AtlaskitIcon';
import { externalPackages as packages, docs, patterns } from '../../site';

export function Nav({
  closeNav,
}: RouteComponentProps & { closeNav: () => void }) {
  const groups = (
    <Groups
      onClick={closeNav}
      docs={docs}
      packages={packages}
      patterns={patterns}
    />
  );

  return (
    <Navigation
      isResizeable={false}
      globalPrimaryItemHref={'/'}
      globalPrimaryIcon={
        <Tooltip content="Home" position="right">
          <AtlaskitIcon />
        </Tooltip>
      }
      containerHeaderComponent={() => (
        <AkContainerTitle
          icon={<AtlaskitIcon monochrome />}
          text={'Atlaskit'}
          href={'/'}
        />
      )}
    >
      {groups}
    </Navigation>
  );
}

export default function MobileNav({
  appRouteDetails,
}: {
  appRouteDetails: RouteComponentProps;
}) {
  const [drawerState, setDrawerState] = React.useState<string>('none');

  return (
    <MobileHeader
      navigation={(isOpen: boolean) =>
        isOpen && (
          <Nav closeNav={() => setDrawerState('none')} {...appRouteDetails} />
        )
      }
      menuIconLabel="Open navigation"
      drawerState={drawerState}
      onNavigationOpen={() => setDrawerState('navigation')}
      onDrawerClose={() => setDrawerState('none')}
    />
  );
}
