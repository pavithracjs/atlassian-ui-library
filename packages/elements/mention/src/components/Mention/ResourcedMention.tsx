import * as React from 'react';
import {
  MentionProvider,
  isResolvingMentionProvider,
} from '../../api/MentionResource';
import { MentionEventHandler, isPromise } from '../../types';
import Mention from './';

export interface Props {
  id: string;
  text: string;
  accessLevel?: string;
  mentionProvider?: Promise<MentionProvider>;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
}

export interface State {
  isHighlighted: boolean;
  mentionName?: string;
}

export default class ResourcedMention extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isHighlighted: false,
    };
  }

  componentDidMount() {
    this.handleMentionProvider(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { props } = this;
    if (
      props.id !== nextProps.id ||
      props.mentionProvider !== nextProps.mentionProvider
    ) {
      this.handleMentionProvider(nextProps);
    }
  }

  private handleMentionProvider = (props: Props) => {
    const { id, mentionProvider, text } = props;
    if (mentionProvider) {
      mentionProvider
        .then(provider => {
          const newState: State = {
            isHighlighted: provider.shouldHighlightMention({ id }),
          };
          if (!text && isResolvingMentionProvider(provider)) {
            const mentionName = provider.resolveMentionName(id);
            if (isPromise(mentionName)) {
              mentionName.then(text => {
                this.setState({
                  mentionName: `@${text}`,
                });
              });
            } else {
              newState.mentionName = mentionName;
            }
          }
          this.setState(newState);
        })
        .catch(() => {
          this.setState({
            isHighlighted: false,
          });
        });
    } else {
      this.setState({
        isHighlighted: false,
      });
    }
  };

  render() {
    const { props, state } = this;

    return (
      <Mention
        id={props.id}
        text={state.mentionName || props.text}
        isHighlighted={state.isHighlighted}
        accessLevel={props.accessLevel}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      />
    );
  }
}
