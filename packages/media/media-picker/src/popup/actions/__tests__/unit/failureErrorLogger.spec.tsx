import {
  failureErrorLogger,
  FAILURE_ERROR,
  FailureErrorLoggerPayload,
} from '../../failureErrorLogger';

describe('failureErrorLogger action creator', () => {
  const failureErrorPayload: FailureErrorLoggerPayload = {
    error: 'Some error',
    info: 'Some info',
  };

  it('should create action with given error and info', () => {
    const action = failureErrorLogger(failureErrorPayload);

    expect(action).toEqual({
      type: FAILURE_ERROR,
      ...failureErrorPayload,
    });
  });
});
