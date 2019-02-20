import * as React from 'react';

import Button, { ButtonAppearances } from '../src';

const CustomComponent1 = props => <div {...props} />;
const CustomComponent2 = props => <input type="range" {...props} />;

export default class extends React.Component {
  button = CustomComponent1;

  timer() {
    setTimeout(() => {
      console.log('changed');
      this.button = CustomComponent2;
    }, 1000);
  }

  render() {
    this.timer();
    console.log('this.button', this.button);
    return (
      <div className="sample">
        <Button {...this.props} component={this.button} to="/custom-link">
          With a custom component
        </Button>
      </div>
    );
  }
}
