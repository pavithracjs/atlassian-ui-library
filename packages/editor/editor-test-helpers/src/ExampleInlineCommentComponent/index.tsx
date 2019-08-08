import * as React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import { Popup } from '@atlaskit/editor-common';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import TextArea from '@atlaskit/textarea';
import { generateUuid } from '@atlaskit/adf-schema';

import {
  AnnotationComponentProps,
  AnnotationInfo,
} from '@atlaskit/editor-core';

const getInlineCommentId = () => `inline-comment-${generateUuid()}`;

const getCommentValue = (id: string) => {
  return (
    window.localStorage.getItem(id) ||
    `This is the comment text for annotation ${id}`
  );
};

type InlineCommentProps = {
  comment: AnnotationInfo;
  onDelete: (id: string) => void;
};

class InlineComment extends React.Component<InlineCommentProps> {
  onDelete = () => {
    const {
      comment: { id },
      onDelete,
    } = this.props;

    window.localStorage.removeItem(id);
    onDelete(id);
  };

  render() {
    const { comment } = this.props;

    return (
      <div
        style={{
          backgroundColor: 'white',
          minHeight: '100px',
          width: '250px',
          overflow: 'hidden',
          margin: '8px',
          padding: '4px',
          boxSizing: 'border-box',
          border: '1px solid #e2e2e2',
        }}
      >
        <AvatarItem
          avatar={
            <Avatar
              src="https://api.adorable.io/avatars/80/chaki@me.com.png"
              presence="online"
            />
          }
          key={'mike@atlassian.com'}
          primaryText={'Mike Cannon-Brookes'}
          secondaryText={'mike@atlassian.com'}
        />
        <div style={{ padding: '8px' }}>{getCommentValue(comment.id)}</div>
        <div style={{ padding: '4px' }}>
          <Button appearance="subtle" onClick={this.onDelete} spacing="none">
            <EditorRemoveIcon label="remove comment" />
          </Button>
        </div>
      </div>
    );
  }
}

export type ExampleInlineCommentComponentState = {
  commentingValue: string;
};

export default class ExampleInlineCommentComponent extends React.Component<
  AnnotationComponentProps,
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
    nextProps: AnnotationComponentProps,
    nextState: ExampleInlineCommentComponentState,
  ) {
    return (
      this.props.dom !== nextProps.dom ||
      this.state.commentingValue !== nextState.commentingValue
    );
  }

  saveComment = () => {
    // const { onCreate } = this.props;
    const { commentingValue } = this.state;

    /* 
      Component is responsible for creating the inline comment (sync or async),
      then passes the IC's identifier back to the Editor using onSuccess()
    */
    const id = getInlineCommentId();

    window.localStorage.setItem(id, commentingValue);
    this.setState({ commentingValue: '' });

    // onCreate(id);
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

  renderContent = (comments: Array<AnnotationInfo>) => {
    const { onDelete } = this.props;

    if (comments.length) {
      return comments.map(comment => (
        <InlineComment key={comment.id} comment={comment} onDelete={onDelete} />
      ));
    } else {
      return this.renderInsertComment();
    }
  };

  getStyles(showing: boolean): React.CSSProperties {
    return showing
      ? {
          transition: '200ms width ease-in',
        }
      : {
          width: 0,
          visibility: 'hidden',
          transition: '200ms width ease-in',
        };
  }

  render() {
    const { dom, annotations, textSelection } = this.props;

    // we're only interested in inline comments
    // right now, these are the only types of annotations in ADF
    const comments = annotations.filter(
      annotation => annotation.type === 'inlineComment',
    );

    if (!dom) {
      return;
    }

    return (
      <Popup
        target={dom}
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
        <div style={this.getStyles(!!comments.length || !!textSelection)}>
          {this.renderContent(comments)}
        </div>
      </Popup>
    );
  }
}
