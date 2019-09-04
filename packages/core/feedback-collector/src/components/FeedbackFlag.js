// @flow
import React from 'react';
import { AutoDismissFlag } from '@atlaskit/flag';
import { G300 } from '@atlaskit/theme/colors';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';

type AkProps = {
  isDismissAllowed?: boolean,
  onDismissed?: (...args: Array<any>) => mixed,
};
const FeedbackFlag = (props: AkProps) => (
  <AutoDismissFlag
    icon={<SuccessIcon primaryColor={G300} label="Success" />}
    id="feedbackSent"
    description="Your valuable feedback helps us continually improve our products."
    title="Thanks!"
    {...props}
  />
);

export default FeedbackFlag;
