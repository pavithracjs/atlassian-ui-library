import * as React from 'react';
import TextField from '@atlaskit/textfield';
import { Field } from '@atlaskit/form';
import { Grid, GridColumn } from '@atlaskit/page';
import { ThemingPublicApi } from 'src/theme/types';

type Props = {
  children: (theme: ThemingPublicApi) => React.ReactNode;
};

type State = ThemingPublicApi;
export default class ThemeBuilder extends React.Component<Props, State> {
  state = {
    primaryTextColor: '#8B0000',
    secondaryTextColor: '#ff4c4c',
    primaryHoverBackgroundColor: '#ffcccc',
    secondaryHoverBackgroundColor: '#ffe5e5',
  };

  createUpdateColorFn = (colorName: keyof ThemingPublicApi) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.persist();
    this.setState(state => ({
      ...state,
      [colorName]: `${e.target.value}`,
    }));
  };
  render() {
    return (
      <Grid layout="fixed">
        <GridColumn medium={6}>{this.props.children(this.state)}</GridColumn>

        <GridColumn medium={6}>
          {Object.keys(this.state).map(fieldName => (
            <Field name={fieldName} label={fieldName}>
              {({ fieldProps }: any) => (
                <TextField
                  {...fieldProps}
                  defaultValue={this.state[fieldName as keyof ThemingPublicApi]}
                  onChange={this.createUpdateColorFn(
                    fieldName as keyof ThemingPublicApi,
                  )}
                />
              )}
            </Field>
          ))}

          <h6>Copy your theme:</h6>
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </GridColumn>
      </Grid>
    );
  }
}
