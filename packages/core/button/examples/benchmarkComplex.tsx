import * as React from 'react';
import Button from '../src/components/Button';

const a = [...Array(999)];

export default () => a.map((i, index) => <Button key={index}>Button</Button>);
