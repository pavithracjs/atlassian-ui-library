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
import ContentWrapper from './styled/ContentWrapper';

class InlineEdit extends Component<Props, void> {
  static defaultProps: DefaultProps = {
    onEditRequested: () => {},
    onConfirm: () => {},
    onCancel: () => {},
    disableConfirmOnBlur: false,
    hideActionButtons: false,
    editButtonLabel: 'Edit',
    confirmButtonLabel: 'Confirm',
    cancelButtonLabel: 'Cancel',
  };

  state = {
    onReadViewHover: false,
  };

  editViewRef = React.createRef();

  onCancelClick = (event: any) => {
    event.preventDefault();
    this.props.onCancel();
  };

  onReadViewClick = (event: any) => {
    event.preventDefault();
    this.props.onEditRequested();
  };

  /* Add hover + focus style to readView */
  renderReadView = fieldProps => {
    return (
      <ReadViewContentWrapper
        onMouseEnter={() => this.setState({ onReadViewHover: true })}
        onMouseLeave={() => this.setState({ onReadViewHover: false })}
        onClick={this.onReadViewClick}
      >
        {this.props.readView(fieldProps)}
      </ReadViewContentWrapper>
    );
  };

  /* Add focus style to editView */
  // Should we add onKeyDown listener or cloneElement with onConfirm for the child to implement confirm on enter?
  renderEditView = (fieldProps, ref) => {
    // Add focus style
    return this.props.editView(fieldProps, ref);
  };

  renderActionButtons = () => {
    return (
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
    );
  };

  componentDidUpdate = prevProps => {
    if (this.props.isEditing && this.props.isEditing !== prevProps.isEditing) {
      this.editViewRef.current.focus();
    }
  };

  render() {
    const { defaultValue, validate, label } = this.props;
    return (
      <Form onSubmit={data => this.props.onConfirm(data.inlineEdit)}>
        {({ formProps }) => (
          <form {...formProps}>
            <ContentWrapper>
              <Field
                name="inlineEdit"
                label={label}
                defaultValue={defaultValue}
                validate={validate}
              >
                {({ fieldProps }) => (
                  <div>
                    {this.props.isEditing
                      ? this.renderEditView(fieldProps, this.editViewRef)
                      : this.renderReadView(fieldProps)}
                  </div>
                )}
              </Field>
              {this.props.isEditing &&
                !this.props.hideActionButtons &&
                this.renderActionButtons()}
            </ContentWrapper>
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
