import * as React from 'react';
import { groupStyles, groupItemStyles } from '../styled/ButtonGroup';
import { ButtonAppearances } from '../types';
import { css } from 'emotion';

export type ButtonGroupProps = {
  /** The appearance to apply to all buttons. */
  appearance?: ButtonAppearances;
};

export default class ButtonGroup extends React.Component<ButtonGroupProps> {
  render() {
    const { appearance, children } = this.props;

    return (
      <div className={css(groupStyles)}>
        {React.Children.map(children, (child, idx) => {
          if (!child) {
            return null;
          }
          return (
            <div key={idx} className={css(groupItemStyles)}>
              {appearance
                ? React.cloneElement(child as JSX.Element, { appearance })
                : child}
            </div>
          );
        })}
      </div>
    );
  }
}
