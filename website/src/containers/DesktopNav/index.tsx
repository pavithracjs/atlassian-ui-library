import React from 'react';
import { Skeleton } from '@atlaskit/navigation';
import { RouteComponentProps } from 'react-router-dom';

const SkeletonNav = ({ location }: RouteComponentProps) => {
  const isContainerNavOpen = location.pathname === '/';
  return <Skeleton isCollapsed={isContainerNavOpen} />;
};

const DesktopNav = React.lazy(() => import('./DesktopNav'));
// TODO: type it later
export default (props: any) => (
  <React.Suspense fallback={<SkeletonNav {...props} />}>
    <DesktopNav {...props} />
  </React.Suspense>
);
