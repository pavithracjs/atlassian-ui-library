import * as React from 'react';
import { EmailValidator } from './components/emailValidation';

export type UserPickerProps = {
  /**
   * Used to configure additional information regarding where the
   * user picker has been mounted.
   *
   * The purpose is to give more context as to where user picker events
   * are being fired from, as the current data may not uniquely identify
   * which field is the source.
   *
   * The value will be passed as a data attribute for analytics.
   * Examples include "assignee", "watchers" and "share".
   *
   * A second usage for the fieldId is for server side rendering (SSR) where it must be a unique id per UserPicker
   * instance contained in the serialized SSR content. E.g. a SPA page rendered through SSR that has multiple user pickers.
   *
   * fieldId can be set to null if the integrator is not listening
   * for the analytic events or does not care about SSR.
   */
  fieldId: string | null;
  /** List of users or teams to be used as options by the user picker. */
  options?: OptionData[];
  /** Width of the user picker field. It can be the amount of pixels as numbers or a string with the percentage. */
  width?: number | string;
  /** Sets the minimum width for the menu. If not set, menu will always have the same width of the field. */
  menuMinWidth?: number;
  /** Function used to load options asynchronously. */
  loadOptions?: LoadOptions;
  /** Callback for value change events fired whenever a selection is inserted or removed. */
  onChange?: OnChange;
  /** To enable multi user picker. */
  isMulti?: boolean;
  /** Input text value. */
  search?: string;
  /** Anchor for the user picker popup. */
  anchor?: React.ComponentType<any>;
  /** Controls if user picker menu is open or not. If not provided, UserPicker will control menu state internally. */
  open?: boolean;
  /** Show the loading indicator. */
  isLoading?: boolean;
  /** Callback for search input text change events. */
  onInputChange?: OnInputChange;
  /** Callback for when a selection is made. */
  onSelection?: OnOption;
  /** Callback for when the field gains focus. */
  onFocus?: OnPicker;
  /** Callback for when the field loses focus. */
  onBlur?: OnPicker;
  /** Callback for when the value/s in the picker is cleared. */
  onClear?: OnPicker;
  /** Callback that is triggered when popup picker is closed */
  onClose?: OnPicker;
  /** Appearance of the user picker. */
  appearance?: Appearance;
  /** Display the picker with a subtle style. */
  subtle?: boolean;
  /** Default value for the field to be used on initial render. */
  defaultValue?: Value;
  /** Placeholder text to be shown when there is no value in the field. */
  placeholder?: React.ReactNode;
  /** Message to encourage the user to add more items to user picker. */
  addMoreMessage?: string;
  /** Message to be shown when the menu is open but no options are provided.
   * If message is null, no message will be displayed.
   * If message is undefined, default message will be displayed.
   */
  noOptionsMessage?:
    | ((value: { inputValue: string }) => string | null)
    | string
    | null;
  /** Controls if the user picker has a value or not. If not provided, UserPicker will control the value internally. */
  value?: Value;
  /** Disable all interactions with the picker, putting it in a read-only state. */
  isDisabled?: boolean;
  /** Display a remove button on the single picker. True by default. */
  isClearable?: boolean;
  /** Optional tooltip to display on hover over the clear indicator. */
  clearValueLabel?: string;
  /** Whether the menu should use a portal, and where it should attach. */
  menuPortalTarget?: HTMLElement;
  /** Whether the user is allowed to enter emails as a value. */
  allowEmail?: boolean;
  /** Email option label */
  emailLabel?: string;
  /** Whether to disable interaction with the input */
  disableInput?: boolean;
  /** Override default email validation function. */
  isValidEmail?: EmailValidator;
  /** Override the internal behaviour to automatically focus the control when the picker is open */
  autoFocus?: boolean;
  /** The maximum number options to be displayed in the dropdown menu during any state of search. The value should be non-negative. */
  maxOptions?: number;
  /** Allows clicking on a label with the same id to open user picker. */
  inputId?: string;
};

export type PopupUserPickerProps = UserPickerProps & {
  /** Whether to use the popup version of the single picker */
  target: Target;
  /** Optional title assigned to popup picker */
  popupTitle?: string;
  /**
   *  Reference to the HTMLElement that should be used as a boundary for the popup.
   *  Viewport is used by default.
   */
  boundariesElement?: HTMLElement;
};

export type UserPickerState = {
  options: OptionData[];
  value?: AtlaskitSelectValue;
  inflightRequest: number;
  count: number;
  hoveringClearIndicator: boolean;
  menuIsOpen: boolean;
  inputValue: string;
  resolving: boolean;
};

export interface HighlightRange {
  start: number;
  end: number;
}

export interface UserHighlight {
  name: HighlightRange[];
  publicName: HighlightRange[];
}

export interface TeamHighlight {
  name: HighlightRange[];
  description?: HighlightRange[];
}

export interface OptionData {
  id: string;
  name: string;
  type?: 'user' | 'team' | 'email';
  fixed?: boolean;
}

export const UserType = 'user';

export interface User extends OptionData {
  avatarUrl?: string;
  publicName?: string;
  highlight?: UserHighlight;
  byline?: string;
  type?: 'user';
}

export const TeamType = 'team';

export interface Team extends OptionData {
  avatarUrl?: string;
  description?: string;
  memberCount?: number;
  includesYou?: boolean;
  highlight?: TeamHighlight;
  type: 'team';
}

export type Value = OptionData | OptionData[] | null | undefined;
export const EmailType = 'email';

export interface Email extends OptionData {
  type: 'email';
}

export type ActionTypes =
  | 'select-option'
  | 'deselect-option'
  | 'remove-value'
  | 'pop-value'
  | 'set-value'
  | 'clear'
  | 'create-option';

export type OnChange = (value: Value, action: ActionTypes) => void;

export type OnInputChange = (query?: string) => void;

export type OnPicker = () => void;

export type OnOption = (value: Value) => void;

export type Option = {
  label: string;
  value: string;
  data: OptionData;
};

export interface LoadOptions {
  (searchText?: string):
    | Promisable<OptionData | OptionData[]>
    | Iterable<
        Promisable<OptionData[] | OptionData> | OptionData | OptionData[]
      >;
}

export type Promisable<T> = T | PromiseLike<T>;

export type InputActionTypes =
  | 'set-value'
  | 'input-change'
  | 'input-blur'
  | 'menu-close';

export type AtlaskitSelectValue = Option | Array<Option> | null | undefined;

export type AtlasKitSelectChange = (
  value: AtlaskitSelectValue,
  extraInfo: {
    removedValue?: Option;
    option?: Option;
    action: ActionTypes;
  },
) => void;

export type Appearance = 'normal' | 'compact';

export type Target = (withRef: { ref: any }) => any;
