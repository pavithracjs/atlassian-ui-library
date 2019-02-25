import * as React from 'react';
// import Button from '../src/components/Button';

export default () => {
  const myRef = React.createRef<HTMLDivElement>();
  return <div ref={myRef}>ok.</div>;
};
