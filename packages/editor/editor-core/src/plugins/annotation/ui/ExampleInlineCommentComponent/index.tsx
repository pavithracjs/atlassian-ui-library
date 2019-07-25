import * as React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import { Popup } from '@atlaskit/editor-common';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import TextArea from '@atlaskit/textarea';

import { uuid } from '../../../../utils/input-rules';
import { InlineCommentComponentProps } from '../../types';

const getInlineCommentId = () => `inline-comment-${uuid()}`;

export type ExampleInlineCommentComponentState = {
  commentingValue: string;
};

export default class ExampleInlineCommentComponent extends React.Component<
  InlineCommentComponentProps,
  ExampleInlineCommentComponentState
> {
  state = {
    commentingValue: '',
  };

  componentWillMount() {
    this.setState({
      commentingValue: '',
    });
  }

  shouldComponentUpdate(
    nextProps: InlineCommentComponentProps,
    nextState: ExampleInlineCommentComponentState,
  ) {
    return (
      this.props.dom !== nextProps.dom ||
      this.state.commentingValue !== nextState.commentingValue
    );
  }

  componentDidUpdate(prevProps: InlineCommentComponentProps) {
    const { markerRef, onCancel } = this.props;

    /*
      Since the Editor loses focus when the actual comment is being made,
      we need to add a temporary mark in ProseMirror to show the selection 
      to the user. If the user dismisses the comment creation, the query mark 
      must be removed in the Editor using this callback
    */
    if (!markerRef && prevProps.dom && !this.props.dom) {
      onCancel();
    }
  }

  saveComment = () => {
    const { onSuccess } = this.props;
    const { commentingValue } = this.state;

    /* 
      Component is responsible for creating the inline comment (sync or async),
      then passes the IC's identifier back to the Editor using onSuccess()
    */
    const id = getInlineCommentId();

    window.localStorage.setItem(id, commentingValue);
    this.setState({ commentingValue: '' });

    onSuccess(id);
  };

  renderInsertComment = () => {
    const { commentingValue } = this.state;

    return (
      <div
        style={{
          padding: '10px',
        }}
      >
        <div style={{ paddingBottom: '10px' }}>
          <TextArea
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              this.setState({ commentingValue: event.target.value })
            }
            value={commentingValue}
          />
        </div>
        <Button appearance="primary" onClick={this.saveComment}>
          Save
        </Button>
      </div>
    );
  };

  onDelete = () => {
    const { markerRef, onDelete } = this.props;

    if (markerRef) {
      window.localStorage.removeItem(markerRef);
      onDelete(markerRef);
    }
  };

  getCommentValue(id: string) {
    return (
      window.localStorage.getItem(id) ||
      'Easy! This is just a basic inline comments test!'
    );
  }

  renderShowComment(id: string) {
    return (
      <div
        style={{
          padding: '10px',
        }}
      >
        {this.getCommentValue(id)}
        <div style={{ padding: '5px 0' }}>
          <Button appearance="subtle" onClick={this.onDelete} spacing="none">
            <EditorRemoveIcon label="remove comment" />
          </Button>
        </div>
      </div>
    );
  }

  renderContent = () => {
    const { markerRef } = this.props;

    if (markerRef) {
      return this.renderShowComment(markerRef);
    }

    return this.renderInsertComment();
  };

  getStyles(showing: boolean): React.CSSProperties {
    return showing
      ? {
          backgroundColor: 'white',
          minHeight: '100px',
          width: '250px',
          overflow: 'hidden',
          padding: '5px',
          border: '1px solid #e2e2e2',
          transition: '200ms width ease-in',
        }
      : {
          width: 0,
          visibility: 'hidden',
          transition: '200ms width ease-in',
        };
  }

  render() {
    const { dom, markerRef, textSelection } = this.props;

    return (
      <Popup
        target={
          dom || (document.querySelectorAll('.ProseMirror')[0] as HTMLElement)
        }
        alignY="bottom"
        fitHeight={200}
        fitWidth={200}
        alignX={'right'}
        offset={[
          dom
            ? -(window.innerWidth - dom.getBoundingClientRect().right - 50)
            : 0,
          20,
        ]}
      >
        <div style={this.getStyles(!!markerRef || !!textSelection)}>
          <AvatarItem
            avatar={
              <Avatar
                src="https://api.adorable.io/avatars/80/chaki@me.com.png"
                presence="online"
              />
            }
            key={'vsutrave@atlassian.com'}
            primaryText={'Vijay Sutrave'}
            secondaryText={'vsutrave@atlassian.com'}
          />
          {this.renderContent()}
        </div>
      </Popup>
    );
  }
}
