import * as React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { ButtonProps } from '@atlaskit/button';
import Button from './styles';

export interface Props extends ButtonProps {
  disabled?: boolean;
  hideTooltip?: boolean;
  selected?: boolean;
  title?: string;
  titlePosition?: string;
}

export default class ToolbarButton extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  private handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const { disabled, onClick } = this.props;

    if (!disabled && onClick) {
      onClick(event);
    }
  };

  render() {
    const button = (
      <Button
        appearance="subtle"
        aria-haspopup
        className={this.props.className}
        href={this.props.href}
        aria-label={this.props['aria-label']}
        iconAfter={this.props.iconAfter}
        iconBefore={this.props.iconBefore}
        isDisabled={this.props.disabled}
        isSelected={this.props.selected}
        onClick={this.handleClick}
        spacing={this.props.spacing || 'default'}
        target={this.props.target}
        theme={this.props.theme}
        shouldFitContainer
      >
        {this.props.children}
      </Button>
    );

    const position = this.props.titlePosition || 'top';
    const tooltipContent = !this.props.hideTooltip ? this.props.title : null;

    return this.props.title ? (
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={true}
        position={position}
      >
        {button}
      </Tooltip>
    ) : (
      button
    );
  }
}
