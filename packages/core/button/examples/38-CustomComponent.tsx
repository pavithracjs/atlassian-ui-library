import * as React from 'react';
import Switcher from '@atlaskit/icon/glyph/app-switcher';
import Button, { filterHTMLAttributes } from '../src';
import { ButtonProps } from '../src/types';

const CustomComponent = ({ innerRef, ...props }: ButtonProps) => (
  <header
    ref={innerRef}
    style={{ backgroundColor: 'pink' }}
    {...filterHTMLAttributes(props)}
  />
);

export default () => (
  <div className="sample">
    <Button
      iconBefore={<Switcher label="app switcher" />}
      component={CustomComponent}
    >
      App Switcher custom component
    </Button>
  </div>
);
