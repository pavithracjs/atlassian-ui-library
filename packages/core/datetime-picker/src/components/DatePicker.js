// @flow

import Calendar from '@atlaskit/calendar';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import Select, { mergeStyles } from '@atlaskit/select';
import { borderRadius, layers } from '@atlaskit/theme/constants';
import { N20, B100 } from '@atlaskit/theme/colors';
import { e200 } from '@atlaskit/theme/elevation';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { format, isValid, parse, lastDayOfMonth } from 'date-fns';
import pick from 'lodash.pick';
import React, { Component, type Node, type ElementRef } from 'react';
import styled from 'styled-components';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import { ClearIndicator, defaultDateFormat, padToTwo } from '../internal';
import FixedLayer from '../internal/FixedLayer';

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** Defines the appearance which can be default or subtle - no borders, background or icon.
   * Appearance values will be ignored if styles are parsed via the selectProps.
   */
  appearance?: 'default' | 'subtle',
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** Default for `isOpen`. */
  defaultIsOpen: boolean,
  /** Default for `value`. */
  defaultValue: string,
  /** An array of ISO dates that should be disabled on the calendar. */
  disabled: Array<string>,
  /** The icon to show in the field. */
  icon: Node,
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string,
  /** Props to apply to the container. **/
  innerProps: Object,
  /** Whether or not the field is disabled. */
  isDisabled?: boolean,
  /** Whether or not the dropdown is open. */
  isOpen?: boolean,
  /** The name of the field. */
  name: string,
  /** Called when the field is blurred. */
  onBlur: (e: SyntheticFocusEvent<>) => void,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: string => void,
  /** Called when the field is focused. */
  onFocus: (e: SyntheticFocusEvent<>) => void,
  /* A function for parsing input characters and transforming them into a Date object. By default uses [date-fn's parse method](https://date-fns.org/v1.29.0/docs/parse) */
  parseInputValue: (date: string, dateFormat: string) => Date,
  /* A function for formatting the date displayed in the input. By default composes together [date-fn's parse method](https://date-fns.org/v1.29.0/docs/parse) and [date-fn's format method](https://date-fns.org/v1.29.0/docs/format) to return a correctly formatted date string*/
  formatDisplayLabel: (value: string, dateFormat: string) => string,
  /** Props to apply to the select. This can be used to set options such as placeholder text.
   *  See [here](/packages/core/select) for documentation on select props. */
  selectProps: Object,
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: 'compact' | 'default',
  /** The ISO time that should be used as the input value. */
  value?: string,
  /** Indicates current value is invalid & changes border color */
  isInvalid?: boolean,
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean,
  /** Format the date with a string that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format). */
  dateFormat: string,
  /** Placeholder text displayed in input */
  placeholder?: string,
};

type State = {
  isOpen: boolean,
  value: string,
  /** Value to be shown in the calendar as selected.  */
  selectedValue: string,
  view: string,
  inputValue: string,
};

function getDateObj(date: Date) {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

function getValidDate(iso: string) {
  const date = parse(iso);

  return isValid(date) ? getDateObj(date) : {};
}

const StyledMenu = styled.div`
  background-color: ${N20};
  border-radius: ${borderRadius()}px;
  z-index: ${layers.dialog};
  ${e200};
`;

const Menu = ({ selectProps, innerProps }: Object) => (
  <FixedLayer
    inputValue={selectProps.inputValue}
    containerRef={selectProps.calendarContainerRef}
    content={
      <StyledMenu>
        <Calendar
          {...getValidDate(selectProps.calendarValue)}
          {...getValidDate(selectProps.calendarView)}
          disabled={selectProps.calendarDisabled}
          onChange={selectProps.onCalendarChange}
          onSelect={selectProps.onCalendarSelect}
          ref={selectProps.calendarRef}
          selected={[selectProps.calendarValue]}
          innerProps={innerProps}
        />
      </StyledMenu>
    }
  />
);

class DatePicker extends Component<Props, State> {
  calendarRef: ElementRef<Calendar>;

  containerRef: ?HTMLElement;

  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    dateFormat: defaultDateFormat,
    defaultIsOpen: false,
    defaultValue: '',
    disabled: [],
    formatDisplayLabel: (value: string, dateFormat: string): string =>
      format(parse(value), dateFormat),
    hideIcon: false,
    icon: CalendarIcon,
    id: '',
    innerProps: {},
    isDisabled: false,
    isInvalid: false,
    name: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    parseInputValue: parse,
    placeholder: 'e.g. 2018/01/01',
    selectProps: {},
    spacing: 'default',
  };

  constructor(props: any) {
    super(props);

    const { day, month, year } = getDateObj(new Date());

    this.state = {
      isOpen: this.props.defaultIsOpen,
      inputValue: this.props.selectProps.inputValue,
      selectedValue: this.props.value || this.props.defaultValue,
      value: this.props.defaultValue,
      view:
        this.props.value ||
        this.props.defaultValue ||
        `${year}-${padToTwo(month)}-${padToTwo(day)}`,
    };
  }

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getState = () => {
    return {
      ...this.state,
      ...pick(this.props, ['value', 'isOpen']),
      ...pick(this.props.selectProps, ['inputValue']),
    };
  };

  isDateDisabled = (date: String) => {
    return this.props.disabled.indexOf(date) > -1;
  };

  onCalendarChange = ({ iso }: { iso: string }) => {
    const [year, month, date] = iso.split('-');
    let newIso = iso;

    const parsedDate: number = parseInt(date, 10);
    const parsedMonth: number = parseInt(month, 10);
    const parsedYear: number = parseInt(year, 10);

    const lastDayInMonth: number = lastDayOfMonth(
      new Date(
        parsedYear,
        parsedMonth - 1, // This needs to be -1, because the Date constructor expects an index of the given month
      ),
    ).getDate();

    const parsedLastDayInMonth: number = parseInt(lastDayInMonth, 10);

    if (parsedLastDayInMonth < parsedDate) {
      newIso = `${year}-${padToTwo(parsedMonth)}-${padToTwo(
        parsedLastDayInMonth,
      )}`;
    } else {
      newIso = `${year}-${padToTwo(parsedMonth)}-${padToTwo(parsedDate)}`;
    }

    this.setState({ view: newIso });
  };

  onCalendarSelect = ({ iso }: { iso: string }) => {
    this.setState({
      inputValue: '',
      isOpen: false,
      selectedValue: iso,
      view: iso,
      value: iso,
    });

    this.props.onChange(iso);
  };

  onInputClick = () => {
    if (!this.getState().isOpen) this.setState({ isOpen: true });
  };

  onSelectBlur = (e: SyntheticFocusEvent<HTMLInputElement>) => {
    this.setState({ isOpen: false });
    this.props.onBlur(e);
  };

  onSelectFocus = (e: SyntheticFocusEvent<HTMLInputElement>) => {
    const { value } = this.getState();

    this.setState({
      isOpen: true,
      view: value,
    });

    this.props.onFocus(e);
  };

  onSelectInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { dateFormat, parseInputValue } = this.props;

    if (value) {
      const parsed = parseInputValue(value, dateFormat);
      // Only try to set the date if we have month & day
      if (isValid(parsed)) {
        // We format the parsed date to YYYY-MM-DD here because
        // this is the format expected by the @atlaskit/calendar component
        this.setState({ view: format(parsed, 'YYYY-MM-DD') });
      }
    }

    this.setState({ isOpen: true });
  };

  onSelectKeyDown = (e: SyntheticKeyboardEvent<*>) => {
    const { key, target } = e;
    const { view, selectedValue } = this.getState();

    const keyPressed = key.toLowerCase();

    switch (keyPressed) {
      case 'arrowup':
      case 'arrowdown':
        if (this.calendarRef) {
          e.preventDefault();
          this.calendarRef.navigate(keyPressed.replace('arrow', ''));
        }
        this.setState({ isOpen: true });
        break;
      case 'arrowleft':
      case 'arrowright':
        if (this.calendarRef) {
          e.preventDefault();
          this.calendarRef.navigate(keyPressed.replace('arrow', ''));
        }
        break;
      case 'escape':
      case 'tab':
        this.setState({ isOpen: false });
        break;
      case 'backspace':
        if (
          selectedValue &&
          target instanceof HTMLInputElement &&
          target.value.length < 1
        ) {
          this.setState({
            selectedValue: '',
            value: '',
            view: this.props.defaultValue || format(new Date(), 'YYYY-MM-DD'),
          });
          this.props.onChange('');
        }
        break;
      case 'enter':
        if (!this.isDateDisabled(view)) {
          this.setState({
            inputValue: '',
            isOpen: false,
            selectedValue: view,
            value: view,
            view,
          });
          this.props.onChange(view);
        }
        break;
      default:
        break;
    }
  };

  refCalendar = (ref: ElementRef<typeof Calendar>) => {
    this.calendarRef = ref;
  };

  handleInputChange = (inputValue: string, actionMeta: {}) => {
    const { onInputChange } = this.props.selectProps;
    if (onInputChange) onInputChange(inputValue, actionMeta);
    this.setState({ inputValue });
  };

  getContainerRef = (ref: ?HTMLElement) => {
    const oldRef = this.containerRef;
    this.containerRef = ref;
    // Cause a re-render if we're getting the container ref for the first time
    // as the layered menu requires it for dimension calculation
    if (oldRef == null && ref != null) {
      this.forceUpdate();
    }
  };

  getSubtleControlStyles = (isOpen: boolean) => ({
    border: `2px solid ${isOpen ? B100 : `transparent`}`,
    backgroundColor: 'transparent',
    padding: '1px',
  });

  render() {
    const {
      appearance,
      autoFocus,
      dateFormat,
      disabled,
      formatDisplayLabel,
      hideIcon,
      icon,
      id,
      innerProps,
      isDisabled,
      isInvalid,
      name,
      placeholder,
      selectProps,
      spacing,
    } = this.props;
    const { value, view, isOpen, inputValue } = this.getState();
    const dropDownIcon = appearance === 'subtle' || hideIcon ? null : icon;
    const { styles: selectStyles = {} } = selectProps;
    const controlStyles =
      appearance === 'subtle' ? this.getSubtleControlStyles(isOpen) : {};
    const disabledStyle = isDisabled ? { pointerEvents: 'none' } : {};

    const calendarProps = {
      calendarContainerRef: this.containerRef,
      calendarRef: this.refCalendar,
      calendarDisabled: disabled,
      calendarValue: value,
      calendarView: view,
      onCalendarChange: this.onCalendarChange,
      onCalendarSelect: this.onCalendarSelect,
    };

    return (
      <div
        {...innerProps}
        role="presentation"
        onClick={this.onInputClick}
        onInput={this.onSelectInput}
        onKeyDown={this.onSelectKeyDown}
        ref={this.getContainerRef}
      >
        <input name={name} type="hidden" value={value} />
        <Select
          menuIsOpen={isOpen && !isDisabled}
          openMenuOnFocus
          closeMenuOnSelect
          autoFocus={autoFocus}
          instanceId={id}
          isDisabled={isDisabled}
          onBlur={this.onSelectBlur}
          onFocus={this.onSelectFocus}
          inputValue={inputValue}
          onInputChange={this.handleInputChange}
          components={{
            ClearIndicator,
            DropdownIndicator: dropDownIcon,
            Menu,
          }}
          styles={mergeStyles(selectStyles, {
            control: base => ({
              ...base,
              ...controlStyles,
              ...disabledStyle,
            }),
          })}
          placeholder={placeholder}
          value={
            value && {
              label: formatDisplayLabel(value, dateFormat),
              value,
            }
          }
          {...selectProps}
          {...calendarProps}
          spacing={spacing}
          validationState={isInvalid ? 'error' : 'default'}
        />
      </div>
    );
  }
}

export { DatePicker as DatePickerWithoutAnalytics };

export default withAnalyticsContext({
  componentName: 'datePicker',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEvent('atlaskit')({
      action: 'selectedDate',
      actionSubject: 'datePicker',
      attributes: {
        componentName: 'datePicker',
        packageName,
        packageVersion,
      },
    }),
  })(DatePicker),
);
