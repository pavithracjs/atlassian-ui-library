// @flow
import React, { Component, type Node } from 'react';
import Button from '@atlaskit/button';

import Form, { Field, CheckboxField } from '@atlaskit/form';
import { Checkbox } from '@atlaskit/checkbox';
import Textfield from '@atlaskit/textfield';
import RadioGroup, { AkRadio } from '@atlaskit/field-radio-group';

import ModalDialog, { ModalFooter, ModalTransition } from '../src';

type State = { isOpen: boolean };
export default class AtlaskitFormDemo extends Component<{}, State> {
  state = { isOpen: false };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  onFormSubmit = (data: Object) => console.log(JSON.stringify(data));

  renderFormWrapper = (props: { className: string, children?: Node }) => {
    return (
      <Form onSubmit={this.onFormSubmit}>
        {({ formProps }) => (
          <form className={props.className} {...formProps}>
            {props.children}
          </form>
        )}
      </Form>
    );
  };

  renderFooter = (props: { showKeyline: boolean }) => (
    <ModalFooter showKeyline={props.showKeyline}>
      <span />
      <Button appearance="primary" type="submit">
        Submit to Console
      </Button>
    </ModalFooter>
  );

  render() {
    const { isOpen } = this.state;

    const radioItems = [
      { name: 'color', value: 'red', label: 'Red' },
      { name: 'color', value: 'blue', label: 'Blue' },
      { name: 'color', value: 'yellow', label: 'Yellow' },
    ];

    return (
      <div>
        <Button onClick={this.open}>Open Modal</Button>

        <ModalTransition>
          {isOpen && (
            <ModalDialog
              heading="Form Demo"
              onClose={this.close}
              components={{
                Container: this.renderFormWrapper,
                Footer: this.renderFooter,
              }}
            >
              <p>Enter some text then submit the form to see the response.</p>
              <Field label="Name" name="my-name" defaultValue="">
                {({ fieldProps }) => <Textfield {...fieldProps} />}
              </Field>
              <Field label="Email" name="my-email" defaultValue="">
                {({ fieldProps }) => (
                  <Textfield
                    autoComplete="off"
                    placeholder="gbelson@hooli.com"
                    {...fieldProps}
                  />
                )}
              </Field>

              <CheckboxField name="checkbox" defaultIsChecked>
                {({ fieldProps }) => (
                  <Checkbox {...fieldProps} value="example" label="Checkbox" />
                )}
              </CheckboxField>

              <Field name="radiogroup" defaultValue="">
                {({ fieldProps: { value, ...others } }) => (
                  <RadioGroup
                    items={radioItems}
                    label="Basic Radio Group Example"
                    {...others}
                  >
                    <AkRadio name="standalone" value="singleButton">
                      Radio button
                    </AkRadio>
                  </RadioGroup>
                )}
              </Field>
            </ModalDialog>
          )}
        </ModalTransition>
      </div>
    );
  }
}
