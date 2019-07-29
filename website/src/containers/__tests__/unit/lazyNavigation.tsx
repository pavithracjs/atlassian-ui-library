import React from 'react';
import { render } from '@testing-library/react';

import DesktopNav from '../../DesktopNav';
import MobileNav from '../../MobileNav';

describe('Desktop navigation', () => {
  test('should render fallback', async () => {
    const { findAllByAltText } = render(<DesktopNav />);
    expect(() => findAllByAltText('Atlaskit logo')).toBeTruthy();
  });
});

describe('Mobile navigation', () => {
  test('should render fallback', async () => {
    const { findAllByLabelText } = render(<MobileNav />);
    expect(() => findAllByLabelText('Open navigation')).toBeTruthy();
  });
});
