import React from 'react';
import { headingSizes, HeadingAnchor } from '@atlaskit/editor-common';
import { HeadingLevels } from '../../block-type/types';
import { HeadingComponents } from '@atlaskit/editor-common/src/ui/heading-anchor';

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
        <div className="heading-content" ref={this.props.forwardRef}>
          {visible && (
            <div
              id={headingId}
              className="heading-anchor"
              style={{
                position: 'absolute',
                height: `${headingSizes[HX].lineHeight}em`,
              }}
            >
              <HeadingAnchor onClick={this.props.onClick} />
            </div>
          )}
        </div>
      </HeadingTag>
    );
  }
}

export default Heading;
