import { Color as StatusColor } from '@atlaskit/status/element';

export default interface NativeToWebBridge {
  currentVersion(): string;
  onBoldClicked(): void;
  onItalicClicked(): void;
  onUnderlineClicked(): void;
  onCodeClicked(): void;
  onStrikeClicked(): void;
  onSuperClicked(): void;
  onSubClicked(): void;
  onMentionSelect(id: string, displayName: string): void;
  onMentionPickerResult(result: string): void;
  setContent(content: string): void;
  getContent(): string;
  clearContent(): void;
  onMediaPicked(eventName: string, payload: string): void;
  onPromiseResolved(uuid: string, paylaod: string): void;
  onPromiseRejected(uuid: string): void;
  onBlockSelected(blockType: string): void;
  onOrderedListSelected(): void;
  onBulletListSelected(): void;
  onIndentList(): void;
  onOutdentList(): void;
  onStatusUpdate(text: string, color: StatusColor, uuid: string): void;
  onStatusPickerDismissed(): void;
  onLinkUpdate(text: string, url: string): void;
  insertBlockType(type: string): void;
  scrollToSelection(): void;
  // The height of the UI controls toolbar, and the soft keyboard which sits beneath it (when applicable)
  setKeyboardControlsHeight(height: number): void;
}
