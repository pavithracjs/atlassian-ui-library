import React from 'react';
import { HeadingAnchor } from '@atlaskit/editor-common';
import { HeadingLevels } from '../../block-type/types';
import {
  HeadingComponents,
  HeadingAnchorWrapper,
} from '@atlaskit/editor-common/src/ui/heading-anchor';

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
      <HeadingTag>
        <div ref={this.props.forwardRef}>
          <HeadingAnchorWrapper
            visible={!!visible}
            anchorId={headingId}
            ref={this.props.forwardRef}
          >
            <HeadingAnchor onClick={this.props.onClick} />
          </HeadingAnchorWrapper>
        </div>
      </HeadingTag>
    );
  }
}

export default Heading;
