import React from 'react';
import MobileHeader from '@atlaskit/mobile-header';

const MobileNav = React.lazy(() => import('./MobileNav'));
// TODO: type it later
export default (props: any) => (
  <React.Suspense fallback={<MobileHeader />}>
    <MobileNav {...props} />
  </React.Suspense>
);
