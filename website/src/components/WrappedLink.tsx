import { Link as BaseLink } from 'react-router-dom';
import * as React from 'react';

export interface LinkProps {
  onClick?: (e: Event) => void;
  to: string | Record<string, string | Location> | undefined;
  theme?: any; // TODO: Type correct once theme is typed
  className?: string;
  replace?: boolean;
  style?: {};
  isSelected?: boolean;
}

class Link extends React.PureComponent<LinkProps, {}> {
  render() {
    const { onClick, children, className, to, ...props } = this.props;
    return (
      <BaseLink
        onClick={e => {
          if (performance.mark) {
            performance.clearMarks();
            performance.mark(`navigate-${to}`);
          }
          if (onClick) onClick(e);
        }}
        className={className}
        to={to}
        {...props}
      >
        {children}
      </BaseLink>
    );
  }
}

// exporting like this so it's just replace react-router-dom w/ thisFilePath
export { Link };
