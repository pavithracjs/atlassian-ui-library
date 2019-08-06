import React from 'react';

interface Props {
  anchorId?: string;
}

export const HeadingAnchorWrapperClassName: string = 'heading-anchor-wrapper';

export function HeadingAnchorWrapper(props: Props & React.Props<any>) {
  return (
    <div id={props.anchorId} className={HeadingAnchorWrapperClassName}>
      {props.children}
    </div>
  );
}
