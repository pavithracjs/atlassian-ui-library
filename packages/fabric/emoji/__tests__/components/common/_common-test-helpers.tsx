import EmojiPreview from '../../../src/components/common/EmojiPreview';

export const findEmojiPreviewSection = component =>
  component.update() && component.find('.emojiPreviewSection');

export const findCustomEmojiButton = component =>
  component.update() &&
  component.find(`Button[className="emoji-picker-add-emoji"]`);

export const customEmojiButtonVisible = (component): boolean =>
  findCustomEmojiButton(component).length > 0;

export const findPreview = component => component.update().find(EmojiPreview);

export const previewVisible = component => findPreview(component).length > 0;
