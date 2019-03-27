// @flow

import React, { Fragment } from 'react';
import Input from '@atlaskit/textfield';

import { Note } from '../../components/common';
import { Group, Radio } from '../../components/InputGroup';
import { DialogInner } from '../../components/Popup';

const NOOP = () => {};

type Props = {
  closePopup: (*) => void,
  field: Object,
  invalidMessage: string,
  onChange: (*) => void,
  storedValue: Object,
};
type State = {
  type: string,
  value: string,
};

class TextView extends React.Component<Props, State> {
  state = this.props.storedValue;
  nextInputRef = React.createRef();
  componentDidMount() {
    this.focusNextInput();
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
    const isKeyboardEvent =
      event.nativeEvent.screenX === 0 && event.nativeEvent.screenY === 0;
    const callback = isKeyboardEvent ? NOOP : this.focusNextInput;

    this.setState({ type }, callback);
    const value = type === 'is_not_set' ? null : this.state.value;
    onChange({ type, value });
  };

  // NOTE: resist the urge to use `autoFocus` on the text input; it will break
  // programmatic focus used elsewhere
  focusNextInput = () => {
    const target = this.nextInputRef.current;
    if (target) {
      // wait for the focus trap (Popup) to grab the node that envoked the
      // dialog, before assigning focus within
      setTimeout(() => {
        target.focus();
      }, 10);
    }
  };

  onChangeInput = ({ target }: *) => {
    const { onChange } = this.props;
    const { type } = this.state;

    this.setState({ value: target.value });
    const value = type === 'is_not_set' ? null : target.value;
    onChange({ type, value });
  };

  // TODO: Move to field controller???
  get filterTypes() {
    return this.props.field.getFilterTypes();
  }
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
                    <Input
                      key={m.type}
                      ref={this.nextInputRef}
                      isInvalid={isInvalid}
                      onChange={this.onChangeInput}
                      value={this.state.value}
                    />
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

export default TextView;
