/* eslint-disable no-console */
import * as React from 'react';
import { defaultSchema } from '@atlaskit/adf-schema';

import { document as storyDataDocument } from './story-data';

import EmailSerializer from '../../src';

import { renderDocument } from './render-document';

export interface DemoRendererProps {
  serializer: 'email';
  document?: object;
  maxHeight?: number;
  truncationEnabled?: boolean;
  allowDynamicTextSizing?: boolean;
}

export interface DemoRendererState {
  input: string;
}

export default class RendererDemo extends React.Component<
  DemoRendererProps,
  DemoRendererState
> {
  emailSerializer = new EmailSerializer(defaultSchema, true);
  emailRef?: HTMLIFrameElement;
  inputBox?: HTMLTextAreaElement | null;
  emailTextareaRef?: any;

  constructor(props: DemoRendererProps) {
    super(props);

    const doc = !!this.props.document ? this.props.document : storyDataDocument;

    this.state = {
      input: JSON.stringify(doc, null, 2),
    };
  }

  private onEmailRef = (ref: HTMLIFrameElement | null) => {
    this.emailRef = ref || undefined;

    if (ref && ref.contentDocument) {
      // reset padding/margin for empty iframe with about:src URL
      ref.contentDocument.body.style.padding = '0';
      ref.contentDocument.body.style.margin = '0';

      this.onComponentRendered();
    }
  };

  componentDidMount() {
    this.onComponentRendered();
  }

  componentDidUpdate() {
    this.onComponentRendered();
  }

  render() {
    return (
      <div ref="root" style={{ padding: 20 }}>
        <fieldset style={{ marginBottom: 20 }}>
          <legend>Input</legend>
          <textarea
            id="renderer-value-input"
            style={{
              boxSizing: 'border-box',
              border: '1px solid lightgray',
              fontFamily: 'monospace',
              fontSize: 16,
              padding: 10,
              width: '100%',
              height: 320,
            }}
            ref={ref => {
              this.inputBox = ref;
            }}
            onChange={this.onDocumentChange}
            value={this.state.input}
          />
          <span>
            <button onClick={this.copyHTMLToClipboard}>
              Copy HTML to clipboard
            </button>
            <textarea
              style={{ width: '0px', height: '0px' }}
              ref={ref => {
                this.emailTextareaRef = ref;
              }}
            />
          </span>
        </fieldset>
        {this.renderEmail()}
      </div>
    );
  }

  private onComponentRendered() {
    try {
      const doc = JSON.parse(this.state.input);
      const html = renderDocument<string>(doc, this.emailSerializer).result;

      if (this.emailRef && this.emailRef.contentDocument && html) {
        this.emailRef.contentDocument.body.innerHTML = html;
        this.emailTextareaRef.value = html;
      }
    } catch (ex) {
      console.error(ex);
      // pass
    }
  }

  private renderEmail() {
    if (this.props.serializer !== 'email') {
      return null;
    }

    try {
      JSON.parse(this.state.input);

      return (
        <div>
          <h1>E-mail HTML</h1>
          <iframe
            ref={this.onEmailRef}
            frameBorder="0"
            src="about:blank"
            style={{ width: '100%', height: '800px' }}
          />
        </div>
      );
    } catch (ex) {
      console.error(ex.stack);
      return null;
    }
  }

  private copyHTMLToClipboard = () => {
    if (!this.emailTextareaRef) return;
    this.emailTextareaRef.select();
    document.execCommand('copy');
  };

  private onDocumentChange = () => {
    if (this.inputBox) {
      this.setState({ input: this.inputBox.value });
    }
  };
}
