import React, { Fragment, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@atlaskit/button';
import AuthenticatedNavigation from './00-authenticated-example';
import { AppNavigationSkeleton } from '../src';

const SpacedButton = styled(Button)`
  margin: 20px;
`;

const SkeletonExample = () => {
  const [isSkeleton, setIsSkeleton] = useState(true);

  return (
    <Fragment>
      {isSkeleton ? <AppNavigationSkeleton /> : <AuthenticatedNavigation />}
      <div>
        <SpacedButton onClick={() => setIsSkeleton(!isSkeleton)}>
          Show {isSkeleton ? 'Navigation' : 'Skeleton'}
        </SpacedButton>
      </div>
    </Fragment>
  );
};

export default () => <SkeletonExample />;
