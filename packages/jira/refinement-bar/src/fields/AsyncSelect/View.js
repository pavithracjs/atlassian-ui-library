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

    let visibleOptions = props.value;

    if (field.defaultOptions) {
      visibleOptions = visibleOptions
        .filter(o => !field.defaultOptions.includes(o))
        .concat([
          {
            label: field.defaultOptionsLabel,
            options: field.defaultOptions,
          },
        ]);
    }

    return (
      <DialogInner minWidth={220}>
        <AsyncSelect
          cacheOptions={field.cacheOptions}
          components={selectComponents}
          defaultOptions={visibleOptions}
          defaultOptionsLabel={field.defaultOptionsLabel}
          inputValue={field.inputValue}
          loadOptions={field.loadOptions}
          onInputChange={field.onInputChange}
          onMenuScrollToBottom={field.onMenuScrollToBottom}
          onMenuScrollToTop={field.onMenuScrollToTop}
          placeholder={field.placeholder}
          {...props}
        />
      </DialogInner>
    );
  }
}
