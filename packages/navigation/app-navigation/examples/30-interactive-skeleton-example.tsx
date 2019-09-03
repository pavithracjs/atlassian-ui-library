import React, { Fragment, useState, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import Button from '@atlaskit/button';
import AuthenticatedNavigation from './00-authenticated-example';
import { AppNavigationSkeleton } from '../src';

const SpacedButton = styled(Button)`
  margin: 20px;
`;

const StyledInput = styled.input`
  display: inline;
  margin: 0px 30px 0px 5px;
  width: 50px;
`;

const InteractiveSkeletonExample = () => {
  const [isSkeleton, setIsSkeleton] = useState(true);
  const [itemCounts, setItemCounts] = useState({ primary: 4, secondary: 4 });
  const { primary, secondary } = itemCounts;

  const setCounts = (key: string) => ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    setItemCounts({
      ...itemCounts,
      [key]: parseInt(value),
    });

  return (
    <Fragment>
      {isSkeleton ? (
        <AppNavigationSkeleton
          primaryItemsCount={primary}
          secondaryItemsCount={secondary}
        />
      ) : (
        <AuthenticatedNavigation />
      )}
      <SpacedButton onClick={() => setIsSkeleton(!isSkeleton)}>
        Show {isSkeleton ? 'Navigation' : 'Skeleton'}
      </SpacedButton>
      <p style={{ display: 'inline-block' }}>Primary Items</p>
      <StyledInput
        value={primary}
        type="number"
        min="0"
        max="4"
        onChange={setCounts('primary')}
      />
      <p style={{ display: 'inline-block' }}>Secondary Items</p>
      <StyledInput
        value={secondary}
        type="number"
        min="0"
        max="4"
        onChange={setCounts('secondary')}
      />
    </Fragment>
  );
};

export default InteractiveSkeletonExample;
