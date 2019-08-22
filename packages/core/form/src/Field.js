// @flow
import React, { type Node } from 'react';
import arrayShallowEqual from 'shallow-equal/arrays';
import objectShallowEqual from 'shallow-equal/objects';
import { uid } from 'react-uid';
import memoizeOne from 'memoize-one';
import invariant from 'tiny-invariant';
import { type FieldState, type FieldSubscription } from 'final-form';
import { FormContext, IsDisabledContext } from './Form';
import FieldWrapper, { Label, RequiredIndicator } from './styled/Field';
import translateEvent from './utils/translateEvent';

type FieldProps = {
  id: string,
  isRequired: boolean,
  isDisabled: boolean,
  isInvalid: boolean,
  onChange: any => any,
  onBlur: () => any,
  onFocus: () => any,
  value: any,
  'aria-invalid': 'true' | 'false',
  'aria-labelledby': string,
};

type Props = {
  /* Children to render in the field. Called with props for the field component and other information about the field. */
  children: ({
    fieldProps: FieldProps,
    error: any,
    valid: boolean,
    meta: Meta,
  }) => Node,
  /* The default value of the field. If a function is provided it is called with the current default value of the field. */
  defaultValue: any,
  /* Passed to the ID attribute of the field. Randomly generated if not specified */
  id?: string,
  /* Whether the field is required for submission */
  isRequired?: boolean,
  /* Whether the field is disabled. Defaults to value from context via Form otherwise uses value of this prop. */
  isDisabled: boolean,
  /* Label displayed above the field */
  label?: Node,
  /* The name of the field */
  name: string,
  /* Given what onChange was called with and the current field value return the next field value */
  transform: (event: any, current: any) => any,
  /* validates the current value of field */
  validate?: (
    value: any,
    formState: Object,
    fieldState: Object,
  ) => string | void | Promise<string | void>,
};

type InnerProps = Props & {
  /* Register the Field with the Form. Internal prop - gets set through context. */
  registerField: (
    string,
    any,
    (FieldState) => any,
    FieldSubscription,
    Object,
  ) => any,
};

export type Meta = {
  dirty: boolean,
  dirtySinceLastSubmit: boolean,
  submitFailed: boolean,
  submitting: boolean,
  touched: boolean,
  valid: boolean,
  error: any,
  submitError: any,
};

type State = {
  fieldProps: {
    onChange: any => any,
    onBlur: () => any,
    onFocus: () => any,
    value: any,
  },
  error: any,
  valid: boolean,
  meta: Meta,
};

const shallowEqual = (a, b) =>
  a === b ||
  typeof b === 'function' ||
  (Array.isArray(a) && Array.isArray(b) && arrayShallowEqual(a, b)) ||
  (typeof a === 'object' && typeof b === 'object' && objectShallowEqual(a, b));

// Provides the id of the field to message components.
// This links the message with the field for screen-readers.
export const FieldId = React.createContext();

class FieldInner extends React.Component<InnerProps, State> {
  static defaultProps = {
    registerField: () => () => {},
    transform: translateEvent,
  };

  unregisterField = () => {};

  getFieldId = memoizeOne(name => `${name}-${uid({ id: name })}`);

  state = {
    fieldProps: {
      onChange: () => {},
      onBlur: () => {},
      onFocus: () => {},
      value:
        typeof this.props.defaultValue === 'function'
          ? this.props.defaultValue()
          : this.props.defaultValue,
    },
    error: undefined,
    valid: false,
    meta: {
      dirty: false,
      dirtySinceLastSubmit: false,
      touched: false,
      valid: false,
      submitting: false,
      submitFailed: false,
      error: undefined,
      submitError: undefined,
    },
  };

  register = () => {
    const { defaultValue, name, registerField, validate } = this.props;

    if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
      invariant(
        name,
        '@atlaskit/form: Field components have a required name prop',
      );
    }

    return registerField(
      name,
      defaultValue,
      ({
        change,
        blur,
        focus,
        dirty,
        dirtySinceLastSubmit,
        touched,
        valid,
        submitting,
        submitFailed,
        value,
        error,
        submitError,
      }) => {
        /** Do not update dirtySinceLastSubmit until submission has finished. */
        const modifiedDirtySinceLastSubmit = submitting
          ? this.state.meta.dirtySinceLastSubmit
          : dirtySinceLastSubmit;
        /** Do not update submitFailed until submission has finished. */
        const modifiedSubmitFailed = submitting
          ? this.state.meta.submitFailed
          : submitFailed;

        /** Do not use submitError if the value has changed. */
        const modifiedSubmitError =
          modifiedDirtySinceLastSubmit && this.props.validate
            ? undefined
            : submitError;
        const modifiedError =
          modifiedSubmitError || ((touched || dirty) && error);

        /**
         * If there has been a submit error, then use logic in modifiedError to determine validity,
         * so we can determine when there is a submit error which we do not want to display
         * because the value has been changed.
         */
        const modifiedValid = modifiedSubmitFailed
          ? modifiedError === undefined
          : valid;

        this.setState({
          fieldProps: {
            onChange: e => {
              change(this.props.transform(e, value));
            },
            onBlur: blur,
            onFocus: focus,
            value,
          },
          error: modifiedError,
          /**
           * The following parameters are optionally typed in final-form to indicate that not all parameters need
           * to be subscribed to. We cast them as booleans (using || false), since this is what they are semantically.
           */
          valid: modifiedValid || false,
          meta: {
            dirty: dirty || false,
            dirtySinceLastSubmit: dirtySinceLastSubmit || false,
            touched: touched || false,
            valid: valid || false,
            submitting: submitting || false,
            submitFailed: submitFailed || false,
            error,
            submitError,
          },
        });
      },
      {
        dirty: true,
        dirtySinceLastSubmit: true,
        touched: true,
        valid: true,
        submitting: true,
        submitFailed: true,
        value: true,
        error: true,
        submitError: true,
      },
      {
        getValidator: () => validate,
      },
    );
  };

  componentDidUpdate(prevProps: Props) {
    const { defaultValue, name } = this.props;
    if (
      prevProps.name !== name ||
      !shallowEqual(prevProps.defaultValue, defaultValue)
    ) {
      this.unregisterField();
      this.unregisterField = this.register();
    }
  }

  componentDidMount() {
    this.unregisterField = this.register();
  }

  componentWillUnmount() {
    this.unregisterField();
  }

  render() {
    const { children, isRequired, isDisabled, label, name, id } = this.props;
    const { fieldProps, error, valid, meta } = this.state;
    const fieldId = id || this.getFieldId(name);
    const extendedFieldProps = {
      ...fieldProps,
      name,
      isDisabled,
      isInvalid: Boolean(error),
      isRequired: Boolean(isRequired),
      'aria-invalid': error ? 'true' : 'false',
      'aria-labelledby': `${fieldId}-label ${fieldId}-helper ${fieldId}-valid ${fieldId}-error`,
      id: fieldId,
    };
    return (
      <FieldWrapper>
        {label && (
          <Label id={`${fieldId}-label`} htmlFor={fieldId}>
            {label}
            {isRequired && (
              <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
            )}
          </Label>
        )}
        <FieldId.Provider value={fieldId}>
          {children({ fieldProps: extendedFieldProps, error, valid, meta })}
        </FieldId.Provider>
      </FieldWrapper>
    );
  }
}

// Make it easier to reference context values in lifecycle methods
const Field = (props: Props) => (
  <FormContext.Consumer>
    {registerField => (
      <IsDisabledContext.Consumer>
        {formIsDisabled => (
          <FieldInner
            {...props}
            registerField={registerField}
            isDisabled={formIsDisabled || props.isDisabled}
          />
        )}
      </IsDisabledContext.Consumer>
    )}
  </FormContext.Consumer>
);

Field.defaultProps = {
  defaultValue: undefined,
  isDisabled: false,
  transform: translateEvent,
};

export default Field;
