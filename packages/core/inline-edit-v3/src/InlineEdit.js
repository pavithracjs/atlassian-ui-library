// @flow
import React, { Component } from 'react';

import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import Form, { Field } from '@atlaskit/form';

import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

import type { DefaultProps, Props } from './types';
import ButtonsWrapper from './styled/ButtonsWrapper';
import ButtonWrapper from './styled/ButtonWrapper';
import EditButton from './styled/EditButton';
import ReadViewContentWrapper from './styled/ReadViewContentWrapper';

class InlineEdit extends Component<Props, void> {
  static defaultProps: DefaultProps = {
    onEditRequested: () => {},
    onConfirm: () => {},
    onCancel: () => {},
    disableConfirmOnBlur: false,
    editButtonLabel: 'Edit',
    confirmButtonLabel: 'Confirm',
    cancelButtonLabel: 'Cancel',
  };

  state = {
    onReadViewHover: false,
  };

  onCancelClick = (event: any) => {
    event.preventDefault();
    this.props.onCancel();
  };

  /* Add hover + focus style to readView */
  renderReadView = fieldProps => {
    return (
      <ReadViewContentWrapper
        onMouseEnter={() => {
          console.log('mouseEnter');
          this.setState({ onReadViewHover: true });
        }}
        onMouseLeave={() => {
          console.log('mouseLeave');
          this.setState({ onReadViewHover: false });
        }}
        onClick={this.props.onEditRequested}
      >
        {this.props.readView(fieldProps)}
      </ReadViewContentWrapper>
    );
  };

  /* Add focus style to editView */
  // Should we add onKeyDown listener or cloneElement with onConfirm for the child to implement confirm on enter?
  renderEditView = fieldProps => {
    // Add focus style
    return this.props.editView(fieldProps);
  };

  renderActionButtons = () => {
    this.props.isEditing && !this.props.areActionButtonsHidden ? (
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button
            ariaLabel={this.props.confirmButtonLabel}
            type="submit"
            iconBefore={<ConfirmIcon size="small" />}
            shouldFitContainer
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            ariaLabel={this.props.cancelButtonLabel}
            iconBefore={<CancelIcon size="small" />}
            onClick={this.onCancelClick}
            shouldFitContainer
          />
        </ButtonWrapper>
      </ButtonsWrapper>
    ) : null;
  };

  render() {
    const { defaultValue, validate, label } = this.props;
    return (
      <Form onSubmit={data => this.props.onConfirm(data.inlineEdit)}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field
              name="inlineEdit"
              label={label}
              defaultValue={defaultValue}
              validate={validate}
            >
              {({ fieldProps }) => (
                <div>
                  {this.props.isEditing
                    ? this.renderEditView(fieldProps)
                    : this.renderReadView(fieldProps)}
                  {this.renderActionButtons()}
                </div>
              )}
            </Field>
          </form>
        )}
      </Form>
    );
  }
}

export { InlineEdit as InlineEditWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'inlineEdit-v3',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onCancel: createAndFireEventOnAtlaskit({
      action: 'canceled',
      actionSubject: 'inlineEdit-v3',

      attributes: {
        componentName: 'inlineEdit-v3',
        packageName,
        packageVersion,
      },
    }),

    onConfirm: createAndFireEventOnAtlaskit({
      action: 'confirmed',
      actionSubject: 'inlineEdit-v3',

      attributes: {
        componentName: 'inlineEdit-v3',
        packageName,
        packageVersion,
      },
    }),
  })(InlineEdit),
);
