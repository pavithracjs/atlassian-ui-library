import * as React from 'react';
import Switcher from '@atlaskit/icon/glyph/app-switcher';
import Button, { filterHTMLAttributes } from '../src';
import { ButtonProps } from '../src/types';

const CustomComponent = ({ innerRef, primary, ...props }: ButtonProps) => (
  <header
    ref={innerRef}
    style={{ backgroundColor: primary ? 'pink' : 'yellow' }}
    {...filterHTMLAttributes(props)}
  />
);

export default () => (
  <div className="sample">
    <Button primary iconBefore={<Switcher />} component={CustomComponent}>
      App Switcher custom component
    </Button>
  </div>
);
