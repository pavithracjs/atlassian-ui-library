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

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import { PropsRenderProps } from '../types';
import ButtonsWrapper from '../styled/ButtonsWrapper';
import ButtonWrapper from '../styled/ButtonWrapper';
import ReadViewContentWrapper from '../styled/ReadViewContentWrapper';
import ContentWrapper from '../styled/ContentWrapper';
import EditButton from '../styled/EditButton';

interface State {
  onReadViewHover: boolean;
  initialValue: any;
  wasFocusReceivedSinceLastBlur: boolean;
}

class InlineEdit extends React.Component<PropsRenderProps, State> {
  confirmButtonRef: HTMLButtonElement | undefined;
  cancelButtonRef: HTMLButtonElement | undefined;

  static defaultProps = {
    disableConfirmOnBlur: false,
    hideActionButtons: false,
    editButtonLabel: 'Edit',
    confirmButtonLabel: 'Confirm',
    cancelButtonLabel: 'Cancel',
  };

  constructor(props: PropsRenderProps) {
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

  onWrapperBlur = (value: any) => {
    if (!this.props.disableConfirmOnBlur) {
      this.setState({ wasFocusReceivedSinceLastBlur: false });
      setTimeout(() => this.confirmIfUnfocused(value));
    }
  };

  onWrapperFocus = () => {
    this.setState({ wasFocusReceivedSinceLastBlur: true });
  };

  confirmIfUnfocused = (value: any) => {
    if (!this.state.wasFocusReceivedSinceLastBlur) this.props.onConfirm(value);
  };

  renderReadView = () => {
    const { children, isEditing } = this.props;
    return (
      <div style={{ lineHeight: 1 }}>
        <EditButton type="button" onClick={this.onReadViewClick} />
        <ReadViewContentWrapper
          onMouseEnter={() => this.setState({ onReadViewHover: true })}
          onMouseLeave={() => this.setState({ onReadViewHover: false })}
          onClick={this.onReadViewClick}
        >
          {children(isEditing)}
        </ReadViewContentWrapper>
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
      label,
      validate,
      isEditing,
      children,
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
                    {children(isEditing, fieldProps)}
                    {!hideActionButtons && this.renderActionButtons()}
                  </ContentWrapper>
                )}
              </Field>
            ) : (
              <Field name="inlineEdit" label={label} defaultValue="">
                {() => <div>{this.renderReadView()}</div>}
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
