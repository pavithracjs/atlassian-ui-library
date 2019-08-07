import React, { Component, ElementRef } from 'react';
import Button from '@atlaskit/button';
import Textfield from '../src';

interface Props {};
interface FormRef {
  focus: () => any,
};

class TextFieldExample extends Component<Props> {
  input: FormRef;

  handleRef = (ref: ElementRef<*>) => {
    this.input = ref;
  };

  handleFocus = () => {
    this.input.focus();
  };

  render() {
    return (
      <div>
        <Textfield ref={this.handleRef} />
        <p>
          <Button appearance="primary" onClick={this.handleFocus}>
            Focus Textfield
          </Button>
        </p>
      </div>
    );
  }
}

export default TextFieldExample;
