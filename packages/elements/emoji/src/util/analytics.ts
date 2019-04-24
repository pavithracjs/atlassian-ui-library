import {
  createAndFireEvent,
  AnalyticsEventPayload,
  CreateAndFireEventFunction,
} from '@atlaskit/analytics-next';
import { EmojiDescription } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

export const createAndFireEventInElementsChannel: CreateAndFireEventFunction = createAndFireEvent(
  'fabric-elements',
);

const createEvent = (
  eventType: 'ui' | 'operational',
  action: string,
  actionSubject: string,
  actionSubjectId?: string,
  attributes = {},
): AnalyticsEventPayload => ({
  eventType,
  action,
  actionSubject,
  actionSubjectId,
  attributes: {
    packageName,
    packageVersion,
    ...attributes,
  },
});

interface Duration {
  duration: number;
}

const emojiPickerEvent = (
  action: string,
  attributes = {},
  actionSubjectId?: string,
) => createEvent('ui', action, 'emojiPicker', actionSubjectId, attributes);

export const openedPickerEvent = () => emojiPickerEvent('opened');

export const closedPickerEvent = (attributes: Duration) =>
  emojiPickerEvent('closed', attributes);

interface EmojiAttributes {
  emojiId: string;
  baseEmojiId?: string; // mobile only
  skinToneModifier?: string;
  gender?: string;
  category: string;
  type: string;
}

export const pickerClickedEvent = (
  attributes: { queryLength: number } & EmojiAttributes & Duration,
) => emojiPickerEvent('clicked', attributes, 'emoji');

export const categoryClickedEvent = (attributes: { category: string }) =>
  emojiPickerEvent('clicked', attributes, 'category');

export const pickerSearchedEvent = (attributes: {
  queryLength: number;
  numMatches: number;
}) => emojiPickerEvent('searched', attributes, 'query');

const skintoneSelectorEvent = (action: string, attributes = {}) =>
  createEvent('ui', action, 'emojiSkintoneSelector', undefined, attributes);

export const toneSelectedEvent = (attributes: { skinToneModifier: string }) =>
  skintoneSelectorEvent('clicked', attributes);

export const toneSelectorOpenedEvent = (attributes: {
  skinToneModifier?: string;
}) => skintoneSelectorEvent('opened', attributes);

export const toneSelectorClosedEvent = () => skintoneSelectorEvent('cancelled');

const emojiUploaderEvent = (
  action: string,
  actionSubjectId?: string,
  attributes?: any,
) => createEvent('ui', action, 'emojiUploader', actionSubjectId, attributes);

export const uploadBeginButton = () =>
  emojiUploaderEvent('clicked', 'addButton');

export const uploadConfirmButton = (attributes: { retry: boolean }) =>
  emojiUploaderEvent('clicked', 'confirmButton', attributes);

export const uploadCancelButton = () =>
  emojiUploaderEvent('clicked', 'cancelButton');

export const uploadSucceededEvent = (attributes: Duration) =>
  createEvent(
    'operational',
    'finished',
    'emojiUploader',
    undefined,
    attributes,
  );

export const uploadFailedEvent = (attributes: { reason: string } & Duration) =>
  createEvent('operational', 'failed', 'emojiUploader', undefined, attributes);

interface EmojiId {
  emojiId?: string;
}

export const deleteBeginEvent = (attributes: EmojiId) =>
  createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiTrigger', attributes);

export const deleteConfirmEvent = (attributes: EmojiId) =>
  createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiConfirm', attributes);

export const deleteCancelEvent = (attributes: EmojiId) =>
  createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiCancel', attributes);

export const selectedFileEvent = () =>
  createEvent('ui', 'clicked', 'emojiUploader', 'selectFile');

interface QueryAttributes {
  queryLength: number;
  spaceInQuery: boolean;
}

const extractAttributesFromQuery = (query?: string): QueryAttributes => {
  if (query) {
    return {
      queryLength: query.length,
      spaceInQuery: query.indexOf(' ') !== -1,
    };
  }
  return {
    queryLength: 0,
    spaceInQuery: false,
  };
};

export const typeAheadCancelledEvent = (duration: number, query?: string) =>
  createEvent('ui', 'cancelled', 'emojiTypeAhead', '', {
    duration,
    ...extractAttributesFromQuery(query),
  });

const getPosition = (
  emojiList: EmojiDescription[] | undefined,
  selectedEmoji: EmojiDescription,
): number | undefined => {
  if (emojiList) {
    const index = emojiList.findIndex(emoji => emoji.id === selectedEmoji.id);
    return index === -1 ? undefined : index;
  }
  return;
};

export const typeAheadSelectedEvent = (
  pressed: boolean,
  duration: number,
  emoji: EmojiDescription,
  emojiList?: EmojiDescription[],
  query?: string,
  skinToneModifier?: string,
  exactMatch?: boolean,
) =>
  createEvent('ui', pressed ? 'pressed' : 'clicked', 'emojiTypeAhead', '', {
    baseEmojiId: emoji.id,
    duration,
    position: getPosition(emojiList, emoji),
    ...extractAttributesFromQuery(query),
    emojiType: emoji.type,
    skinToneModifier,
    exactMatch: exactMatch || false,
  });

export const typeAheadRenderedEvent = (duration: number) =>
  createEvent('operational', 'rendered', 'emojiTypeAhead', '', {
    duration,
  });
