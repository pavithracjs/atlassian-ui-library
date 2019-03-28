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

import {
  InlineEditUncontrolledProps,
  FieldChildProps,
  FormChildProps,
  InlineDialogProps,
} from '../types';
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
} from '../version.json';

interface State {
  onReadViewHover: boolean;
  wasFocusReceivedSinceLastBlur: boolean;
  preventFocusOnEditButton: boolean;
}

const defaultProps: Pick<
  InlineEditUncontrolledProps,
  'keepEditViewOpenOnBlur' | 'hideActionButtons' | 'readViewFitContainerWidth'
> = {
  keepEditViewOpenOnBlur: false,
  hideActionButtons: false,
  readViewFitContainerWidth: false,
};

/** This means that InlineDialog is only loaded if necessary */
const InlineDialog = Loadable<InlineDialogProps, {}>({
  loader: () =>
    import('@atlaskit/inline-dialog').then(module => module.default),
  loading: () => null,
});

class InlineEdit extends React.Component<InlineEditUncontrolledProps, State> {
  confirmButtonRef?: HTMLElement;
  cancelButtonRef?: HTMLElement;
  editButtonRef?: HTMLElement;

  state = {
    onReadViewHover: false,
    wasFocusReceivedSinceLastBlur: false,
    preventFocusOnEditButton: false,
  };

  componentDidUpdate(prevProps: InlineEditUncontrolledProps) {
    /**
     * This logic puts the focus on the edit button after confirming using
     * the confirm button or using the keyboard to confirm, but not when
     * it is confirmed by wrapper blur
     */
    if (prevProps.isEditing && !this.props.isEditing) {
      if (this.state.preventFocusOnEditButton) {
        this.setState({ preventFocusOnEditButton: false });
      } else if (this.editButtonRef) {
        this.editButtonRef.focus();
      }
    }
  }

  onCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    /** This prevents clicking on cancel button from calling onConfirm */
    if (this.cancelButtonRef) {
      this.cancelButtonRef.focus();
    }
    this.props.onCancel();
  };

  onReadViewClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    const element = event.target as HTMLElement;
    /** If a link is clicked in the read view, default action should be taken */
    if (element.tagName.toLowerCase() !== 'a') {
      event.preventDefault();
      this.props.onEditRequested();
    }
  };

  /** Unless keepEditViewOpenOnBlur prop is true, will call confirmIfUnfocused() which
   *  confirms the value, unless the focus is transferred to the buttons
   */
  onWrapperBlur = (
    isInvalid: boolean,
    onSubmit: (e: React.FormEvent | any) => void,
    formRef: React.RefObject<HTMLFormElement>,
  ) => {
    if (!this.props.keepEditViewOpenOnBlur) {
      this.setState({ wasFocusReceivedSinceLastBlur: false });
      /**
       * This ensures that clicking on one of the action buttons will call
       * onWrapperFocus before confirmIfUnfocused is called
       */
      setTimeout(() => this.confirmIfUnfocused(isInvalid, onSubmit, formRef));
    }
  };

  /** Gets called when focus is transferred to the editView, or action buttons */
  onWrapperFocus = () => {
    this.setState({ wasFocusReceivedSinceLastBlur: true });
  };

  confirmIfUnfocused = (
    isInvalid: boolean,
    onSubmit: (e: React.FormEvent | any) => void,
    formRef: React.RefObject<HTMLFormElement>,
  ) => {
    if (
      !isInvalid &&
      !this.state.wasFocusReceivedSinceLastBlur &&
      formRef.current
    ) {
      this.setState({ preventFocusOnEditButton: true });
      if (formRef.current.checkValidity()) {
        onSubmit({});
      }
    }
  };

  renderReadView = () => {
    return (
      <ReadViewWrapper>
        <EditButton
          aria-label="Edit"
          type="button"
          onClick={this.onReadViewClick}
          innerRef={ref => {
            this.editButtonRef = ref;
          }}
        />
        <ReadViewContentWrapper
          onMouseEnter={() => this.setState({ onReadViewHover: true })}
          onMouseLeave={() => this.setState({ onReadViewHover: false })}
          onClick={this.onReadViewClick}
          readViewFitContainerWidth={this.props.readViewFitContainerWidth}
        >
          {this.props.readView}
        </ReadViewContentWrapper>
      </ReadViewWrapper>
    );
  };

  renderActionButtons = () => {
    return (
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button
            ariaLabel="Confirm"
            type="submit"
            iconBefore={<ConfirmIcon label="Confirm" size="small" />}
            shouldFitContainer
            onClick={() => {
              /** This prevents clicking on confirm button from calling onConfirm twice */
              if (this.confirmButtonRef) {
                this.confirmButtonRef.focus();
              }
            }}
            onMouseDown={() => {
              /** Prevents focus on edit button only if mouse is used to click button */
              this.setState({ preventFocusOnEditButton: true });
            }}
            innerRef={ref => {
              this.confirmButtonRef = ref;
            }}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            ariaLabel="Cancel"
            iconBefore={<CancelIcon label="Cancel" size="small" />}
            onClick={this.onCancelClick}
            onMouseDown={() => {
              /** Prevents focus on edit button only if mouse is used to click button */
              this.setState({ preventFocusOnEditButton: true });
            }}
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
        {({
          formProps: { onKeyDown, onSubmit, ref: formRef },
        }: FormChildProps) => (
          <form
            onKeyDown={e => {
              onKeyDown(e);
              if (e.key === 'Esc' || e.key === 'Escape') {
                this.props.onCancel();
              }
            }}
            onSubmit={onSubmit}
            ref={formRef}
          >
            {isEditing ? (
              <Field
                name="inlineEdit"
                label={label}
                defaultValue={defaultValue}
                validate={validate}
              >
                {({ fieldProps, error }: FieldChildProps) => (
                  <ContentWrapper
                    onBlur={() =>
                      this.onWrapperBlur(
                        fieldProps.isInvalid,
                        onSubmit,
                        formRef,
                      )
                    }
                    onFocus={this.onWrapperFocus}
                  >
                    <div>
                      {validate && (
                        <InlineDialog
                          isOpen={fieldProps.isInvalid}
                          content={error}
                          placement="right"
                        >
                          <InlineDialogChild />
                        </InlineDialog>
                      )}
                      {this.props.editView(fieldProps)}
                    </div>
                    {!hideActionButtons && this.renderActionButtons()}
                  </ContentWrapper>
                )}
              </Field>
            ) : (
              /** Field is used here only for the label */
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
  componentName: 'inlineEdit',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onCancel: createAndFireEventOnAtlaskit({
      action: 'canceled',
      actionSubject: 'inlineEdit',

      attributes: {
        componentName: 'inlineEdit',
        packageName,
        packageVersion,
      },
    }),

    onConfirm: createAndFireEventOnAtlaskit({
      action: 'confirmed',
      actionSubject: 'inlineEdit',

      attributes: {
        componentName: 'inlineEdit',
        packageName,
        packageVersion,
      },
    }),

    onEditRequested: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'inlineEdit',

      attributes: {
        componentName: 'inlineEdit',
        packageName,
        packageVersion,
      },
    }),
  })(InlineEdit),
);
