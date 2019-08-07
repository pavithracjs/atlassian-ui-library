import React from 'react';
import {
  clipboardApiSupported,
  copyToClipboard,
  copyToClipboardLegacy,
} from '../../utils/copy-to-clipboard';

const isClipboardApiSupported = clipboardApiSupported();

const CopyTextContext = React.createContext<{
  copyTextToClipboard: (textToCopy: string) => Promise<void>;
}>({
  copyTextToClipboard: () =>
    new Promise<void>((_resolve, reject) =>
      reject('"copyTextToClipboard" is not initialized'),
    ),
});

const { Provider, Consumer } = CopyTextContext;

export const CopyArea = React.forwardRef((props: any, ref) => (
  <div
    ref={ref}
    style={{
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }}
    {...props}
  />
));

export class CopyTextProvider extends React.Component {
  private copyAreaRef: React.RefObject<HTMLElement> = React.createRef();

  copyTextToClipboard = (textToCopy: string): Promise<void> => {
    if (isClipboardApiSupported) {
      return copyToClipboard(textToCopy);
    } else {
      return copyToClipboardLegacy(textToCopy, this.copyAreaRef.current);
    }
  };

  render() {
    return (
      <>
        {!isClipboardApiSupported && <CopyArea ref={this.copyAreaRef} />}
        <Provider
          value={{
            copyTextToClipboard: this.copyTextToClipboard,
          }}
        >
          {this.props.children}
        </Provider>
      </>
    );
  }
}

export { Consumer as CopyTextConsumer };
export { CopyTextContext };
