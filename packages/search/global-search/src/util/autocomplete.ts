import memoizeOne from 'memoize-one';

export const getAutocomplete = memoizeOne(
  (query: string, autocompleteSuggestions?: string[]) => {
    if (!autocompleteSuggestions || !query || query.length === 0) {
      return undefined;
    }
    if (autocompleteSuggestions.length === 0) {
      return query;
    }
    const lowerCaseQuery = query.toLowerCase();
    const match = autocompleteSuggestions.find(suggestion =>
      suggestion.toLowerCase().startsWith(lowerCaseQuery),
    );
    if (!match) {
      return;
    }
    return `${query}${match.slice(query.length)}`;
  },
);
