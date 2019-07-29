import React from 'react';
import { Skeleton } from '@atlaskit/navigation';
import { RouteComponentProps } from 'react-router-dom';

const SkeletonNav = ({ location }: RouteComponentProps) => {
  const isContainerNavOpen = location ? location.pathname === '/' : true;
  // The theme appearance for skeleton should always be global.
  const globalAppearance = 'global';
  return (
    <Skeleton
      isCollapsed={isContainerNavOpen}
      AppearanceOptions={globalAppearance}
    />
  );
};

const DesktopNav = React.lazy(() => import('./DesktopNav'));
// TODO: type it later
export default (props: any) => (
  <React.Suspense fallback={<SkeletonNav {...props} />}>
    <DesktopNav {...props} />
  </React.Suspense>
);
