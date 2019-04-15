// @flow

import React from 'react';
import AsyncSelect from '../AsyncSelect/View';
import { formatOptionLabel } from '../IssueSelect/View';

// do NOT assign directly; a new component must be created to avoid inheritence
const IssueAsyncSelectView = (props: *) => <AsyncSelect {...props} />;

IssueAsyncSelectView.defaultProps = {
  formatOptionLabel,
};

export default IssueAsyncSelectView;
