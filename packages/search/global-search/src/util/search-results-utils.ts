import { Result } from '../model/Result';

export const appendListWithoutDuplication = (
  resultsFirst: Result[],
  resultsSecond: Result[],
) => {
  return resultsFirst.concat(
    resultsSecond.filter(result => {
      return (
        resultsFirst.findIndex(o => {
          return o.resultId === result.resultId;
        }) === -1
      );
    }),
  );
};
