import React from 'react';
import { HeadingAnchor, HeadingLevels } from '@atlaskit/editor-common';
import {
  HeadingComponents,
  HeadingAnchorWrapper,
} from '@atlaskit/editor-common';

export interface Props {
  level: HeadingLevels;
  forwardRef?: any;
  headingId?: string;
  isTopLevelHeading: boolean;
  onClick: () => Promise<void>;
}

class Heading extends React.PureComponent<Props & React.Props<any>> {
  render() {
    const { headingId } = this.props;
    const HX = `h${this.props.level}`;

    const visible = this.props.isTopLevelHeading && headingId;

    const HeadingTag = HeadingComponents[HX];

    return (
      <HeadingTag innerRef={this.props.forwardRef}>
        <HeadingAnchorWrapper anchorId={headingId}>
          {!!visible && <HeadingAnchor onClick={this.props.onClick} />}
        </HeadingAnchorWrapper>
      </HeadingTag>
    );
  }
}

export default Heading;
