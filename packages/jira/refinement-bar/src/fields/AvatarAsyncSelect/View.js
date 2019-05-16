// @flow

import React from 'react';
import AsyncSelect from '../AsyncSelect/View';
import { formatOptionLabel } from '../AvatarSelect/View';

// do NOT assign directly; a new component must be created to avoid inheritence
const AvatarAsyncSelectView = (props: *) => <AsyncSelect {...props} />;

AvatarAsyncSelectView.defaultProps = {
  formatOptionLabel,
};

export default AvatarAsyncSelectView;
