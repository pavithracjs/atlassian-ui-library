// @flow
/** @jsx jsx */

import { PureComponent } from 'react';
import { jsx } from '@emotion/core';
import { makeAsyncSelect } from '@atlaskit/select';

import { BaseSelect, selectComponents } from '../../components/Select';
import { DialogInner } from '../../components/Popup';

const AsyncSelect = makeAsyncSelect(BaseSelect);

type State = {
  inputValue: string,
};

export default class AsyncSelectView extends PureComponent<*, State> {
  state = { inputValue: '' };

  render() {
    const {
      storedValue,
      field,
      isRemovable,
      onRemove,
      loadOptions,
      ...props
    } = this.props;

    const visibleOptions = props.value
      .filter(o => !field.defaultOptions.includes(o))
      .concat([{ label: 'Recommended', options: field.defaultOptions }]);

    return (
      <DialogInner minWidth={220}>
        <AsyncSelect
          components={selectComponents}
          defaultOptions={visibleOptions}
          loadOptions={field.loadOptions}
          {...props}

          // alternative behaviour; don't throw away results on select...
          // onInputChange={(newValue, { action }) => {
          //   const inputValue =
          //     action === 'set-value' ? this.state.inputValue : newValue;
          //   this.setState({ inputValue });
          //
          //   return inputValue;
          // }}
        />
      </DialogInner>
    );
  }
}
