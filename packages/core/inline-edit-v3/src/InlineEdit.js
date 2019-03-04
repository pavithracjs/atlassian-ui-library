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
import ReadViewContentWrapper from './styled/ReadViewContentWrapper';
import ContentWrapper from './styled/ContentWrapper';

type State = {
  onReadViewHover: boolean,
  initialValue: any,
};

class InlineEdit extends Component<Props, State> {
  editViewRef: { current: null | HTMLInputElement };
  formRef: { current: null | HTMLFormElement };

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

  constructor(props: Props) {
    super(props);
    this.state = {
      onReadViewHover: false,
      initialValue: '',
    };

    this.editViewRef = React.createRef();
    this.formRef = React.createRef();
  }

  onCancelClick = (event: any) => {
    event.preventDefault();
    this.props.onCancel();
  };

  onReadViewClick = (event: any) => {
    event.preventDefault();
    this.props.onEditRequested();
  };

  onEditViewBlur = value => {
    if (!this.props.disableConfirmOnBlur) this.props.onConfirm(value);
  };

  /* Add hover + focus style to readView */
  renderReadView = () => {
    return (
      <ReadViewContentWrapper
        onMouseEnter={() => this.setState({ onReadViewHover: true })}
        onMouseLeave={() => this.setState({ onReadViewHover: false })}
        onClick={this.onReadViewClick}
      >
        {this.props.readView}
      </ReadViewContentWrapper>
    );
  };

  /* Add focus style to editView */
  // Should we add onKeyDown listener or cloneElement with onConfirm for the child to implement confirm on enter?
  renderEditView = (
    fieldProps: any,
    editViewRef: { current: null | HTMLInputElement },
  ) => {
    // Add focus style
    return (
      <div onBlur={() => this.onEditViewBlur(fieldProps.value)}>
        {this.props.editView(fieldProps, editViewRef)}
      </div>
    );
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

  componentDidUpdate = (prevProps: Props) => {
    if (
      this.props.isEditing &&
      this.props.isEditing !== prevProps.isEditing &&
      this.editViewRef.current
    ) {
      this.editViewRef.current.focus();
    }
  };

  render() {
    const {
      defaultValue,
      hideActionButtons,
      isEditing,
      label,
      validate,
    } = this.props;
    return (
      <Form onSubmit={data => this.props.onConfirm(data.inlineEdit)}>
        {({ formProps }) => (
          <form {...formProps}>
            <ContentWrapper>
              {isEditing ? (
                <Field
                  name="inlineEdit"
                  label={label}
                  defaultValue={defaultValue}
                  validate={validate}
                >
                  {({ fieldProps }) => (
                    <>
                      <div>
                        {this.renderEditView(fieldProps, this.editViewRef)}
                      </div>
                      {!hideActionButtons && this.renderActionButtons()}
                    </>
                  )}
                </Field>
              ) : (
                <Field name="inlineEdit" label={label} defaultValue="">
                  {() => <div>{this.renderReadView()}</div>}
                </Field>
              )}
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
