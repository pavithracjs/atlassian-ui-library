import React from 'react';

interface Props {
  anchorId?: string;
  visible?: boolean;
}

export const HeadingAnchorWrapperClass: string = 'heading-anchor-wrapper';

export function HeadingAnchorWrapper(props: Props & React.Props<any>) {
  return props.visible ? (
    <div id={props.anchorId} className={HeadingAnchorWrapperClass}>
      {props.children}
    </div>
  ) : null;
}
