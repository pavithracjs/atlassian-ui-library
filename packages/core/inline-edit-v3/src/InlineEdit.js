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

import type { Props } from './types';
import ButtonsWrapper from './styled/ButtonsWrapper';
import ButtonWrapper from './styled/ButtonWrapper';
import ReadViewContentWrapper from './styled/ReadViewContentWrapper';
import ContentWrapper from './styled/ContentWrapper';
import EditButton from './styled/EditButton';
import ReadViewWrapper from './styled/ReadViewWrapper';

type State = {
  onReadViewHover: boolean,
  initialValue: any,
  wasFocusReceivedSinceLastBlur: boolean,
};

class InlineEdit extends Component<Props, State> {
  confirmButtonRef: null | HTMLButtonElement;
  cancelButtonRef: null | HTMLButtonElement;

  static defaultProps = {
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
      wasFocusReceivedSinceLastBlur: false,
    };
  }

  onCancelClick = (event: any) => {
    event.preventDefault();
    if (this.cancelButtonRef) this.cancelButtonRef.focus();
    this.props.onCancel();
  };

  onReadViewClick = (event: any) => {
    if (event.target.tagName.toLowerCase() === 'a') {
      return;
    }
    event.preventDefault();
    this.props.onEditRequested();
  };

  /** Unless disableConfirmOnBlur prop is true, will call confirmIfUnfocused() which
   *  confirms the value, unless the focus is transferred to the buttons
   */
  onWrapperBlur = (value: any) => {
    if (!this.props.disableConfirmOnBlur) {
      this.setState({ wasFocusReceivedSinceLastBlur: false });
      setTimeout(() => this.confirmIfUnfocused(value));
    }
  };

  /** Gets called when focus is transferred to the editView, or action buttons */
  onWrapperFocus = () => {
    this.setState({ wasFocusReceivedSinceLastBlur: true });
  };

  confirmIfUnfocused = (value: any) => {
    if (!this.state.wasFocusReceivedSinceLastBlur) this.props.onConfirm(value);
  };

  renderReadView = () => {
    return (
      <ReadViewWrapper>
        <EditButton type="button" onClick={this.onReadViewClick} />
        <ReadViewContentWrapper
          onMouseEnter={() => this.setState({ onReadViewHover: true })}
          onMouseLeave={() => this.setState({ onReadViewHover: false })}
          onClick={this.onReadViewClick}
        >
          {this.props.readView}
        </ReadViewContentWrapper>
      </ReadViewWrapper>
    );
  };

  renderEditView = (fieldProps: {}) => this.props.editView(fieldProps);

  renderActionButtons = () => {
    return (
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button
            ariaLabel={this.props.confirmButtonLabel}
            type="submit"
            iconBefore={<ConfirmIcon size="small" />}
            shouldFitContainer
            onClick={() => {
              if (this.confirmButtonRef) this.confirmButtonRef.focus();
            }}
            innerRef={ref => {
              this.confirmButtonRef = ref;
            }}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            ariaLabel={this.props.cancelButtonLabel}
            iconBefore={<CancelIcon size="small" />}
            onClick={this.onCancelClick}
            shouldFitContainer
            innerRef={ref => {
              this.cancelButtonRef = ref;
            }}
          />
        </ButtonWrapper>
      </ButtonsWrapper>
    );
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
            {isEditing ? (
              <Field
                name="inlineEdit"
                label={label}
                defaultValue={defaultValue}
                validate={validate}
              >
                {({ fieldProps }) => (
                  <ContentWrapper
                    onBlur={() => this.onWrapperBlur(fieldProps.value)}
                    onFocus={this.onWrapperFocus}
                  >
                    <div>{this.renderEditView(fieldProps)}</div>
                    {!hideActionButtons && this.renderActionButtons()}
                  </ContentWrapper>
                )}
              </Field>
            ) : (
              <Field name="inlineEdit" label={label} defaultValue="">
                {() => this.renderReadView()}
              </Field>
            )}
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
