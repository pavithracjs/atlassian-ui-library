/**  @jsx jsx */
import { forwardRef } from 'react';
import { jsx } from '@emotion/core';

export default forwardRef((
  // @ts-ignore - createAnalyticsEvent is injected from WithAnalyticsEvents HOC
  { createAnalyticsEvent, ...props }: React.HTMLProps<HTMLInputElement>,
  ref: React.Ref<HTMLInputElement>,
) => (
  <input
    ref={ref}
    css={{
      left: '50%',
      margin: 0,
      opacity: 0,
      padding: 0,
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      top: '50%',
    }}
    {...props}
  />
));
