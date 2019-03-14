import * as React from 'react';

import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import Form, { Field } from '@atlaskit/form';
import { withDefaultProps } from '@atlaskit/type-helpers';

import { Props, FieldChild, FormChild } from '../types';
import ButtonsWrapper from '../styled/ButtonsWrapper';
import ButtonWrapper from '../styled/ButtonWrapper';
import ReadViewContentWrapper from '../styled/ReadViewContentWrapper';
import ContentWrapper from '../styled/ContentWrapper';
import EditButton from '../styled/EditButton';
import ReadViewWrapper from '../styled/ReadViewWrapper';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

interface State {
  onReadViewHover: boolean;
  initialValue: any;
  wasFocusReceivedSinceLastBlur: boolean;
}

const defaultProps: Pick<
  Props,
  | 'disableConfirmOnBlur'
  | 'hideActionButtons'
  | 'editButtonLabel'
  | 'confirmButtonLabel'
  | 'cancelButtonLabel'
> = {
  disableConfirmOnBlur: false,
  hideActionButtons: false,
  editButtonLabel: 'Edit',
  confirmButtonLabel: 'Confirm',
  cancelButtonLabel: 'Cancel',
};

class InlineEdit extends React.Component<Props, State> {
  confirmButtonRef?: HTMLElement;
  cancelButtonRef?: HTMLElement;

  state = {
    onReadViewHover: false,
    initialValue: '',
    wasFocusReceivedSinceLastBlur: false,
  };

  onCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.cancelButtonRef) this.cancelButtonRef.focus();
    this.props.onCancel();
  };

  onReadViewClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    const element = event.target as HTMLElement;
    if (element.tagName.toLowerCase() !== 'a') {
      event.preventDefault();
      this.props.onEditRequested();
    }
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

  renderEditView = (fieldProps: any) => this.props.editView(fieldProps);

  renderActionButtons = () => {
    const { confirmButtonLabel, cancelButtonLabel } = this.props;
    return (
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button
            ariaLabel={confirmButtonLabel}
            type="submit"
            iconBefore={<ConfirmIcon label={confirmButtonLabel} size="small" />}
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
            ariaLabel={cancelButtonLabel}
            iconBefore={<CancelIcon label={cancelButtonLabel} size="small" />}
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
      <Form
        onSubmit={(data: { inlineEdit: any }) =>
          this.props.onConfirm(data.inlineEdit)
        }
      >
        {({ formProps }: FormChild) => (
          <form {...formProps}>
            {isEditing ? (
              <Field
                name="inlineEdit"
                label={label}
                defaultValue={defaultValue}
                validate={validate}
              >
                {({ fieldProps }: FieldChild) => (
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

export const InlineEditWithoutAnalytics = withDefaultProps(
  defaultProps,
  InlineEdit,
);

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
