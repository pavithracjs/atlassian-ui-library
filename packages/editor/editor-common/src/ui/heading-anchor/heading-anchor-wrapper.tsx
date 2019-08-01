import React from 'react';

interface Props {
  anchorId?: string;
}

export const HeadingAnchorWrapperClass: string = 'heading-anchor-wrapper';

export function HeadingAnchorWrapper(props: Props & React.Props<any>) {
  return (
    <div id={props.anchorId} className={HeadingAnchorWrapperClass}>
      {props.children}
    </div>
  );
}
