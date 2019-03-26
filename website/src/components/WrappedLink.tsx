import { Link as BaseLink } from 'react-router-dom';
import * as React from 'react';
import { LocationDescriptor } from 'history';

export interface LinkProps {
  onClick?: (e: any) => void;
  to: string | Record<string, string | Location> | undefined;
  theme?: any; // TODO: Type correct once theme is typed
  className?: string;
  replace?: boolean;
  style?: {};
  isSelected?: boolean;
  children?: React.ReactNode;
}

class Link extends React.PureComponent<LinkProps, {}> {
  render() {
    const { onClick, to, ...rest } = this.props;
    return (
      <BaseLink
        onClick={e => {
          if (performance.mark) {
            performance.clearMarks();
            performance.mark(`navigate-${to}`);
          }
          if (onClick) onClick(e);
        }}
        to={to as LocationDescriptor}
        {...rest}
      />
    );
  }
}

// exporting like this so it's just replace react-router-dom w/ thisFilePath
export { Link };
