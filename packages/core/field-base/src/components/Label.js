// @flow
import React, { Component, type Node } from 'react';

import { LabelWrapper, RequiredIndicator, LabelInner } from '../styled/Label';

type Props = {
  /** the label text to display */
  label: string,
  /** whether to hide the label */
  isLabelHidden?: boolean,
  /** onclick handler */
  onClick?: (event: any) => mixed,
  /** show a style indicating that the label is for a required field */
  isRequired?: boolean,
  /** Sets whether the disabled style is applied to the label */
  isDisabled?: boolean,
  /** the labels control element */
  htmlFor?: string,
  /** any children to render, displayed underneath the label */
  children?: Node,
  /** controls the appearance of the label */
  appearance?: 'default' | 'inline-edit',
  /** controls the top margin of the label */
  isFirstChild?: boolean,
};

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    'The @atlaskit/field-base package has been deprecated. Please use the Form/Textfield/Textarea/etc packages instead.',
  );
}

export default class Label extends Component<Props, void> {
  static defaultProps = {
    appearance: 'default',
  };

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  render() {
    const {
      appearance,
      children,
      htmlFor,
      isFirstChild,
      isLabelHidden,
      isDisabled,
      isRequired,
      label,
      onClick,
    } = this.props;
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <LabelWrapper htmlFor={htmlFor}>
        <LabelInner
          isHidden={isLabelHidden}
          inlineEdit={appearance === 'inline-edit'}
          firstChild={isFirstChild}
          isDisabled={isDisabled}
        >
          <span onClick={onClick}>{label}</span>
          {isRequired ? (
            <RequiredIndicator role="presentation">*</RequiredIndicator>
          ) : null}
        </LabelInner>
        {children}
      </LabelWrapper>
    );
  }
}
