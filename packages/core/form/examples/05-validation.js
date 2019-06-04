// @flow
import React, { Component, Fragment } from 'react';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Form, {
  Field,
  FormFooter,
  ErrorMessage,
  HelperMessage,
  ValidMessage,
} from '../src';

export default class extends Component<{}> {
  validateValue = '';

  serverValidate = (
    value: string,
  ): Promise<?{ value: string, error: string }> =>
    new Promise(resolve => {
      setTimeout(() => {
        if (value.length <= 2) {
          resolve({ value, error: 'TOO_SHORT' });
        }
        if (['jill', 'joe', 'jillian', 'jack'].find(v => v === value)) {
          resolve({ value, error: 'IN_USE' });
        }
        resolve(undefined);
      }, 500);
    });

  validate = (value: string) => {
    this.validateValue = value;
    return this.serverValidate(value).then(validateObject => {
      if (validateObject && validateObject.value === this.validateValue) {
        return validateObject.error;
      }
      return undefined;
    });
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          width: '400px',
          maxWidth: '100%',
          margin: '0 auto',
          flexDirection: 'column',
        }}
      >
        <Form onSubmit={data => console.log(data)}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field
                name="username"
                label="Username"
                defaultValue=""
                isRequired
                validate={this.validate}
              >
                {({ fieldProps, error, meta: { valid } }) => (
                  <Fragment>
                    <TextField {...fieldProps} />
                    {!error && !valid && (
                      <HelperMessage>
                        Pick a memorable name that others will see
                      </HelperMessage>
                    )}
                    {valid && (
                      <ValidMessage>
                        Nice one, this username is available
                      </ValidMessage>
                    )}
                    {error === 'TOO_SHORT' && (
                      <ErrorMessage>
                        Too short, username needs to be more than 2 characters
                      </ErrorMessage>
                    )}
                    {error === 'IN_USE' && (
                      <ErrorMessage>
                        This username is taken by somebody, try something else
                      </ErrorMessage>
                    )}
                  </Fragment>
                )}
              </Field>
              <FormFooter>
                <Button type="submit">Next</Button>
              </FormFooter>
            </form>
          )}
        </Form>
      </div>
    );
  }
}
