import * as React from 'react';
import Button from '@atlaskit/button';
import Form, { CheckboxField, FormFooter } from '@atlaskit/form';
import { Checkbox } from '../src';

export default () => (
  <Form name="example-form" onSubmit={() => {}}>
    {({ formProps }: { formProps: React.Component }) => (
      <form {...formProps}>
        <CheckboxField name="remember" isRequired>
          {({ fieldProps }: { fieldProps: React.Component }) => (
            <Checkbox {...fieldProps} label="Remember me" />
          )}
        </CheckboxField>
        <FormFooter>
          <Button type="submit">Next</Button>
        </FormFooter>
      </form>
    )}
  </Form>
);
