import * as React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next-types';

import InlineEditUncontrolled from './InlineEditUncontrolled';
import { InlineEditProps } from '../types';

type State = {
  isEditing: boolean;
};

class InlineEdit extends React.Component<InlineEditProps, State> {
  static defaultProps = {
    keepEditViewOpenOnBlur: false,
    hideActionButtons: false,
    readViewFitContainerWidth: false,
    startWithEditViewOpen: false,
    editButtonLabel: 'Edit',
    confirmButtonLabel: 'Confirm',
    cancelButtonLabel: 'Cancel',
  };

  editViewRef = React.createRef<HTMLElement>();

  state = {
    isEditing: this.props.startWithEditViewOpen || false,
  };

  componentDidMount() {
    if (this.props.startWithEditViewOpen && this.editViewRef.current) {
      this.editViewRef.current.focus();
    }
  }

  onConfirm = (value: string, analyticsEvent: UIAnalyticsEvent) => {
    this.setState({
      isEditing: false,
    });
    this.props.onConfirm(value, analyticsEvent);
  };

  onCancel = () => {
    this.setState({
      isEditing: false,
    });
  };

  onEditRequested = () => {
    this.setState({ isEditing: true }, () => {
      if (this.editViewRef.current) {
        this.editViewRef.current.focus();
      }
    });
  };

  render() {
    return (
      <InlineEditUncontrolled
        {...this.props}
        editValue={this.props.editValue}
        editView={fieldProps =>
          this.props.editView({ ...fieldProps, ref: this.editViewRef })
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

export default InlineEdit;
