// @flow
/** @jsx jsx */

import { jsx } from '@emotion/core';
import { HiddenButton } from './common';

const Form = props => (
  <form
    css={{
      '&:first-of-type': {
        marginTop: 0,
      },
    }}
    {...props}
  />
);
const Label = ({ htmlFor, ...props }: *) => (
  <label
    htmlFor={htmlFor} // because linter...
    css={{
      alignItems: 'center',
      display: 'flex',
      marginBottom: 8,
      marginTop: 8,

      ':first-of-type': {
        marginTop: 0,
      },
      ':last-of-type': {
        marginBottom: 0,
      },

      span: {
        marginLeft: 4,
      },
    }}
    {...props}
  />
);

export const Group = ({ children, ...props }: *) => (
  <Form {...props}>
    {children}
    <HiddenButton type="submit" tabIndex="-1" />
  </Form>
);

let controlId = 0;

export const Radio = ({ children, ...props }: *) => {
  const id = `refinement-bar-dialog-radio-${++controlId}`;

  return (
    <Label htmlFor={id}>
      <input type="radio" id={id} {...props} />
      <span>{children}</span>
    </Label>
  );
};
