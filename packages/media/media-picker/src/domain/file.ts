export type MediaFile = {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly creationDate: number;
  readonly type: string;
  readonly occurrenceKey?: string;
};

export function copyMediaFileForUpload(
  { name, size, creationDate, type, occurrenceKey }: MediaFile,
  fileId: string,
): MediaFile {
  // We dont' use spread here because user upload events are not sanitized
  return {
    id: fileId,
    name,
    size,
    creationDate,
    type,
    occurrenceKey,
  };
}
