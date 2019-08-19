import { mentionData } from '../../json-data/mention-data.json';

declare var require: {
  <T>(path: string): T;
};

export const mentionData = mentionData as any; // MentionsResult

export const mentionResult: any[] = mentionData.mentions;

export const mentionDataSize = mentionResult.length;
