import * as React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { UserPicker } from '../src/components/UserPicker';

export default class Example extends React.Component<{}> {
  render() {
    return (
      <div style={{ height: '1500px' }}>
        <ExampleWrapper>
          {({ options, onInputChange }) => (
            <UserPicker
              fieldId="example"
              options={options}
              onChange={console.log}
              onInputChange={onInputChange}
              isMulti
            />
          )}
        </ExampleWrapper>
      </div>
    );
  }
}
