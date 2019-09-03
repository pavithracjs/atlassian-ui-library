export const formatAnalyticsEventActionLabel = (word?: string) =>
  word
    ? 'mediaCard' +
      word
        .split(/\s/)
        .map(
          (substr: string) =>
            substr.charAt(0).toUpperCase() + substr.slice(1).toLowerCase(),
        )
        .join('')
    : 'mediaCardUnlabelledAction';
