declare module '@atlaskit/field-text-area' {
  import { Component, FormEvent } from 'react';

  export interface FieldTextAreaStatelessProps {
    compact?: boolean;
    disabled?: boolean;
    isReadOnly?: boolean;
    required?: boolean;
    isInvalid?: boolean;
    label: string;
    name?: string;
    placeholder?: string;
    value?: string | number;
    onBlur?: (event: SyntheticInputEvent<HTMLTextAreaElement>) => mixed;
    onChange?: (event: SyntheticInputEvent<HTMLTextAreaElement>) => mixed;
    onFocus?: (event: SyntheticInputEvent<HTMLTextAreaElement>) => mixed;
    id?: string;
    isLabelHidden?: boolean;
    isMonospaced?: boolean;
    invalidMessage?: Node;
    shouldFitContainer?: boolean;
    isSpellCheckEnabled?: boolean;
    autoFocus?: boolean;
    maxLength?: number;
    minimumRows?: number;
    enableResize?: boolean | 'horizontal' | 'vertical';
    type?: string;
    isValidationHidden?: boolean;
  }

  export interface FieldTextAreaProps {
    compact?: boolean;
    disabled?: boolean;
    isReadOnly?: boolean;
    required?: boolean;
    isInvalid?: boolean;
    label?: string;
    name?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: any;
    id?: string;
    isLabelHidden?: boolean;
    isMonospaced?: boolean;
    invalidMessage?: Node;
    shouldFitContainer?: boolean;
    isSpellCheckEnabled?: boolean;
    autoFocus?: boolean;
    maxLength?: number;
    minimumRows?: number;
    enableResize?: boolean | 'horizontal' | 'vertical';
  }

  export class FieldTextAreaStateless extends Component<
    FieldTextAreaStatelessProps,
    {}
  > {}
  export default class FieldTextArea extends Component<
    FieldTextAreaProps,
    {}
  > {}
}
