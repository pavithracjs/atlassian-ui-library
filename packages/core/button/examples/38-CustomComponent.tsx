import * as React from 'react';
import Switcher from '@atlaskit/icon/glyph/app-switcher';
import Button from '../src';

const CustomComponent = React.forwardRef<HTMLElement, {}>((props, ref) => (
  <header {...props} ref={ref} style={{ backgroundColor: 'pink' }} />
));

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
