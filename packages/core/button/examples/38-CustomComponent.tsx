import * as React from 'react';
import Switcher from '@atlaskit/icon/glyph/app-switcher';
import Button from '../src';
import { ButtonProps } from '../src/types';

export default () => (
  <div className="sample">
    <Button
      iconBefore={<Switcher label="app switcher" />}
      component={React.forwardRef<HTMLElement, ButtonProps>((props, ref) => (
        <header {...props} ref={ref} style={{ backgroundColor: 'pink' }} />
      ))}
    >
      App Switcher custom component
    </Button>
  </div>
);
