// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';

import ViewController from './ViewController';

type Props = {|
  children: ViewController => Node,
|};

export default (props: Props) => <Subscribe to={[ViewController]} {...props} />;
