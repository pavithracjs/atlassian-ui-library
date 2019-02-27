import * as React from 'react';
import Switcher from '@atlaskit/icon/glyph/app-switcher';
import Button, { filterHTMLAttributes } from '../src';

export default () => (
  <div className="sample">
    <Button
      iconBefore={<Switcher label="app switcher" />}
      component={props => (
        <header
          ref={props.innerRef}
          style={{ backgroundColor: 'pink' }}
          {...filterHTMLAttributes(props)}
        />
      )}
    >
      App Switcher custom component
    </Button>
  </div>
);
