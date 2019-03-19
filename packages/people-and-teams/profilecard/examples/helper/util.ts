import { getMockProfileClient as getMockProfileClientUtil } from '../../mock-helpers';
import { ProfileClient, modifyResponse } from '../../src';
import { ProfilecardProps } from '../../src/types';

export const getMockProfileClient = (
  cacheSize: number,
  cacheMaxAge: number,
  extraProps: ProfilecardProps = {},
) => {
  const MockProfileClient = getMockProfileClientUtil(
    ProfileClient,
    response => {
      return {
        ...modifyResponse(response),
        ...extraProps,
      };
    },
  );

  return new MockProfileClient({
    cacheSize,
    cacheMaxAge,
  });
};

export default null;
