import React from 'react';
import { render, waitForElement } from '@testing-library/react';

import DesktopNav from '../../DesktopNav';
import MobileNav from '../../MobileNav';

test('DesktopNav should be lazy rendered ', async () => {
  const { getByText } = render(<DesktopNav isCollapsed />);
  const lazyDesktop = await waitForElement(() => getByText(''));
  expect(lazyDesktop).toBeDefined();
});

test('MobileNav should be lazy rendered', async () => {
  const { getByText } = render(<MobileNav isCollapsed />);
  const lazyMobile = await waitForElement(() => getByText(''));
  expect(lazyMobile).toBeDefined();
});
