// @flow

import React, { createRef, Children, Fragment, PureComponent } from 'react';
import Input from '@atlaskit/textfield';

import { Note } from '../../components/common';
import { Group, Radio } from '../../components/InputGroup';
import { DialogInner } from '../../components/Popup';
import { isEmptyString } from '../../utils';

type Props = {
  storedValue: Object,
  field: Object,
  invalidMessage: Object,
  onChange: (*) => void,
  closePopup: (*) => void,
};
type State = {
  single: string,
  type: string,
  gt: string,
  lt: string,
};

const getInitialState = (storedValue: *) => {
  const { type, value } = storedValue;
  const base = { gt: '', lt: '', type, single: '' };

  return typeof value === 'number'
    ? { ...base, single: value }
    : { ...base, ...value };
};

class NumberView extends PureComponent<Props, State> {
  state = getInitialState(this.props.storedValue);

  nextInputRef = createRef();

  componentDidMount() {
    this.focusNextInput();
  }

  get isBetween() {
    return this.state.type === 'between';
  }

  get filterTypes() {
    return this.props.field.getFilterTypes();
  }

  handleSubmit = (e: *) => {
    e.preventDefault();
    if (this.props.invalidMessage) return;

    if (typeof this.props.closePopup === 'function') {
      this.props.closePopup(); // HACK? (imperative)
    }
  };

  onChangeCheckbox = (event: *) => {
    const { onChange } = this.props;
    const type = event.target.value;
    const isNotSet = type === 'is_not_set';
    const isKeyboardEvent =
      event.nativeEvent.screenX === 0 && event.nativeEvent.screenY === 0;

    this.setState({ type }, () => {
      if (!isKeyboardEvent) {
        this.focusNextInput();
      }

      // avoid creating an invalid state where '' === NaN
      if (isEmptyString(this.state.single) && !isNotSet) {
        return;
      }

      const { gt, lt } = this.state;
      let value = this.state.single;
      if (this.isBetween) {
        value = { gt, lt };
      } else if (isNotSet) {
        value = null;
      }

      onChange({ type, value });
    });
  };

  onChangeInput = (event: *) => {
    const { name } = event.target;
    const val = Number(event.target.value);
    const { onChange } = this.props;
    const { type } = this.state;

    this.setState({ [name]: val }, () => {
      const { gt, lt } = this.state;
      const value = this.isBetween ? { gt, lt } : val;
      onChange({ type, value });
    });
  };

  // NOTE: resist the urge to use `autoFocus` on the text input; it will break
  // programmatic focus used elsewhere
  focusNextInput = () => {
    const el = this.nextInputRef.current;

    if (el && typeof el.focus === 'function') {
      // wait for the focus trap (Popup) to grab the node that envoked the
      // dialog, before assigning focus within
      setTimeout(() => {
        el.focus();
      }, 10);
    }
  };

  render() {
    const { field, invalidMessage } = this.props;
    const { type } = this.state;
    const isInvalid = Boolean(invalidMessage);

    return (
      <DialogInner isPadded maxWidth={160}>
        <Group onSubmit={this.handleSubmit}>
          {this.filterTypes.map(m => {
            const isCurrent = m.type === type;

            return (
              <Fragment key={m.type}>
                <Radio
                  checked={isCurrent}
                  name="mode"
                  onChange={this.onChangeCheckbox}
                  type="radio"
                  value={m.type}
                >
                  {m.label}
                </Radio>
                {isCurrent && m.hasInput ? (
                  <>
                    {m.type === 'between' ? (
                      <InputRow>
                        <Input
                          ref={this.nextInputRef}
                          name="gt"
                          isInvalid={isInvalid}
                          onChange={this.onChangeInput}
                          type="number"
                          value={this.state.gt}
                        />
                        <Input
                          name="lt"
                          isInvalid={isInvalid}
                          onChange={this.onChangeInput}
                          type="number"
                          value={this.state.lt}
                        />
                      </InputRow>
                    ) : (
                      <Input
                        ref={this.nextInputRef}
                        isInvalid={isInvalid}
                        name="single"
                        onChange={this.onChangeInput}
                        type="number"
                        value={this.state.single}
                      />
                    )}
                    {invalidMessage && <Note>{invalidMessage}</Note>}
                  </>
                ) : null}
              </Fragment>
            );
          })}
        </Group>
        {field.note && <Note>{field.note}</Note>}
      </DialogInner>
    );
  }
}

// ==============================
// Styled Components
// ==============================

const InputRow = ({ children, ...props }: *) => (
  <div
    {...props}
    style={{
      display: 'flex',
      marginLeft: -4,
      marginRight: -4,
    }}
  >
    {Children.map(children, c => (
      <div style={{ marginLeft: 4, marginRight: 4 }}>{c}</div>
    ))}
  </div>
);

export default NumberView;
