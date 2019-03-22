import * as React from 'react';
import { withDefaultProps } from '@atlaskit/type-helpers';

import InlineEditUncontrolled from './InlineEditUncontrolled';
import { InlineEditProps } from '../types';

type State = {
  isEditing: boolean;
};

const defaultProps: Pick<
  InlineEditProps,
  | 'disableConfirmOnBlur'
  | 'hideActionButtons'
  | 'readViewFitContainerWidth'
  | 'startInEditView'
> = {
  disableConfirmOnBlur: false,
  hideActionButtons: false,
  readViewFitContainerWidth: false,
  startInEditView: false,
};

class InlineEdit extends React.Component<InlineEditProps, State> {
  editViewRef: HTMLElement | undefined;

  state = {
    isEditing: this.props.startInEditView,
  };

  componentDidMount() {
    if (this.props.startInEditView && this.editViewRef) {
      this.editViewRef.focus();
    }
  }

  onConfirm = (value: string) => {
    this.setState({
      isEditing: false,
    });
    this.props.onConfirm(value);
  };

  onCancel = () => {
    this.setState({
      isEditing: false,
    });
  };

  onEditRequested = () => {
    this.setState({ isEditing: true }, () => {
      if (this.editViewRef) {
        this.editViewRef.focus();
      }
    });
  };

  setRef = (ref: HTMLElement) => {
    this.editViewRef = ref;
  };

  render() {
    return (
      <InlineEditUncontrolled
        {...this.props}
        defaultValue={this.props.defaultValue}
        editView={fieldProps =>
          this.props.editView({ ...fieldProps, ref: this.setRef })
        }
        readView={this.props.readView}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        isEditing={this.state.isEditing}
        onEditRequested={this.onEditRequested}
      />
    );
  }
}

export default withDefaultProps(defaultProps, InlineEdit);
