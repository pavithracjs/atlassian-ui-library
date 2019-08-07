export const clipboardApiSupported = () =>
  !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

// This function is needed for safari and IE
// This function is a synchronous function,
// But it is wrapped into a promise to be consistent with "copyToClipboard".
export const copyToClipboardLegacy = (
  textToCopy: string,
  copyAreaRef: HTMLElement | null,
): Promise<void> =>
  new Promise<void>((resolve: () => void, reject: (str: string) => void) => {
    if (copyAreaRef) {
      const textArea = document.createElement('textarea');
      textArea.readOnly = true;
      textArea.defaultValue = textToCopy;
      copyAreaRef.appendChild(textArea);
      textArea.select();

      const wasCopied = document.execCommand('copy');
      copyAreaRef.removeChild(textArea);
      if (wasCopied) {
        resolve();
      } else {
        reject('Failed to copy');
      }
    } else {
      reject('Copy area reference is not defined');
    }
  });

export const copyToClipboard = (textToCopy: string): Promise<void> =>
  new Promise<void>((resolve: () => void, reject: (str: string) => void) => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => resolve(), e => reject(e));
    } else {
      reject('Clipboard api is not supported');
    }
  });
