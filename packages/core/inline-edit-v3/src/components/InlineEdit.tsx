import * as React from 'react';
import * as Loadable from 'react-loadable';

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

import { Props, FieldChildProps, FormChildProps, FieldProps } from '../types';
import ButtonsWrapper from '../styled/ButtonsWrapper';
import ButtonWrapper from '../styled/ButtonWrapper';
import ReadViewContentWrapper from '../styled/ReadViewContentWrapper';
import ContentWrapper from '../styled/ContentWrapper';
import EditButton from '../styled/EditButton';
import ReadViewWrapper from '../styled/ReadViewWrapper';
import InlineDialogChild from '../styled/InlineDialogChild';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

interface State {
  onReadViewHover: boolean;
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

const InlineDialog = Loadable({
  loader: () =>
    import('@atlaskit/inline-dialog').then(module => module.default),
  loading: () => null,
});

class InlineEdit extends React.Component<Props, State> {
  confirmButtonRef?: HTMLElement;
  cancelButtonRef?: HTMLElement;

  state = {
    onReadViewHover: false,
    wasFocusReceivedSinceLastBlur: false,
  };

  onCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.cancelButtonRef) {
      this.cancelButtonRef.focus();
    }
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
  onWrapperBlur = (isInvalid: boolean) => {
    if (!this.props.disableConfirmOnBlur) {
      this.setState({ wasFocusReceivedSinceLastBlur: false });
      setTimeout(() => this.confirmIfUnfocused(isInvalid));
    }
  };

  /** Gets called when focus is transferred to the editView, or action buttons */
  onWrapperFocus = () => {
    this.setState({ wasFocusReceivedSinceLastBlur: true });
  };

  confirmIfUnfocused = (isInvalid: boolean) => {
    if (
      !isInvalid &&
      !this.state.wasFocusReceivedSinceLastBlur &&
      this.confirmButtonRef
    ) {
      this.confirmButtonRef.click();
    }
  };

  renderReadView = () => {
    return (
      <ReadViewWrapper>
        <EditButton
          aria-label={this.props.editButtonLabel}
          type="button"
          onClick={this.onReadViewClick}
        />
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

  renderEditView = (fieldProps: FieldProps, valid: boolean) =>
    this.props.editView(fieldProps, valid);

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
              if (this.confirmButtonRef) {
                this.confirmButtonRef.focus();
              }
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
        {({ formProps }: FormChildProps) => (
          <form {...formProps}>
            {isEditing ? (
              <Field
                name="inlineEdit"
                label={label}
                defaultValue={defaultValue}
                validate={validate}
              >
                {({ fieldProps, error }: FieldChildProps) => (
                  <ContentWrapper
                    onBlur={() => this.onWrapperBlur(fieldProps.isInvalid)}
                    onFocus={this.onWrapperFocus}
                  >
                    <div>
                      {!!error && (
                        <InlineDialog
                          isOpen={true}
                          content={error}
                          placement="right"
                        >
                          <InlineDialogChild />
                        </InlineDialog>
                      )}
                      {this.renderEditView(fieldProps, !!error)}
                    </div>
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
