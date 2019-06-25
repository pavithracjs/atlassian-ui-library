import React, {
  PureComponent,
  ReactNode,
  SyntheticEvent,
  ElementType,
} from 'react';
import PropTypes from 'prop-types';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Radio from '@atlaskit/icon/glyph/radio';
import Checkbox from '@atlaskit/icon/glyph/checkbox';
import Tooltip from '@atlaskit/tooltip';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import {
  After,
  Before,
  Content,
  ContentWrapper,
  Description,
  InputWrapper,
} from '../styled/Item';
import { getInputBackground, getInputFill } from '../utils';
import { AriaTypes } from '../types';

import Element from './Element';

const inputTypes: { [key in AriaTypes]?: ElementType } = {
  checkbox: Checkbox,
  radio: Radio,
  link: undefined,
  option: undefined,
};

interface Props {
  appearance: 'default' | 'primary';
  children: Node;
  description: string;
  elemAfter: ReactNode;
  elemBefore: ReactNode;
  href: string | null;
  isActive: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  isHidden: boolean;
  isSelected: boolean;
  onActivate: (
    {
      item,
      event,
    }: { item: PureComponent; event: SyntheticEvent<HTMLElement> },
  ) => void;
  target: string;
  title: string;
  tooltipDescription: string | null;
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right';
  type: AriaTypes;
  itemContext?: string;
}

interface State {
  isHovered: boolean;
  isPressed: boolean;
}

class Item extends PureComponent<Props, State> {
  static defaultProps = {
    appearance: 'default',
    children: null,
    description: '',
    elemAfter: null,
    elemBefore: null,
    href: null,
    isActive: false,
    isChecked: false,
    isDisabled: false,
    isFocused: false,
    isHidden: false,
    isSelected: false,
    itemContext: 'menu',
    onActivate: () => {},
    target: null,
    title: null,
    tooltipDescription: null,
    tooltipPosition: 'right',
    type: 'link',
  };

  state = {
    isHovered: false,
    isPressed: false,
  };

  static contextTypes = {
    shouldAllowMultilineItems: PropTypes.bool,
  };

  componentDidMount = () =>
    document.addEventListener('mouseup', this.handleMouseUp);

  componentWillUnmount = () =>
    document.removeEventListener('mouseup', this.handleMouseUp);

  guardedActivate = (event: SyntheticEvent<HTMLElement>) => {
    const { isDisabled, onActivate } = this.props;

    if (!isDisabled && onActivate) onActivate({ item: this, event });
  };

  handleClick = (event: React.MouseEvent<HTMLElement>) =>
    this.guardedActivate(event);

  handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    const keyIsValid = ['Enter', ' '].indexOf(event.key) > -1;

    if (keyIsValid) this.guardedActivate(event);
  };

  handleMouseDown = () => this.setState({ isPressed: true });

  handleMouseUp = () => this.setState({ isPressed: false });

  handleMouseOut = () => this.setState({ isHovered: false });

  handleMouseOver = () => this.setState({ isHovered: true });

  render() {
    const { props } = this;
    const { isHovered, isPressed } = this.state;

    const type: AriaTypes = props.type;
    const hasInput = ['checkbox', 'radio'].includes(type);
    const Input = hasInput && inputTypes[type];

    const appearanceProps = {
      isActive:
        (props.type === 'link' && props.isActive) ||
        (props.type === 'option' && props.isSelected),
      isChecked: hasInput && props.isChecked,
      isDisabled: props.isDisabled,
      isFocused: props.isFocused,
      isHidden: props.isHidden,
      isHovered,
      isPressed,
      isSelected: type === 'option' && props.isSelected,
      isPrimary: props.appearance === 'primary',
    };

    const element = (
      <Element
        {...appearanceProps}
        handleClick={this.handleClick}
        handleKeyPress={this.handleKeyPress}
        handleMouseOut={this.handleMouseOut}
        handleMouseOver={this.handleMouseOver}
        handleMouseUp={this.handleMouseUp}
        handleMouseDown={this.handleMouseDown}
        href={props.href}
        target={props.target}
        title={props.title}
        type={props.type}
      >
        {hasInput && Input && (
          <InputWrapper {...appearanceProps}>
            <Input
              label=""
              primaryColor={getInputBackground(appearanceProps)}
              secondaryColor={getInputFill(appearanceProps)}
              size="medium"
            />
          </InputWrapper>
        )}
        {!!props.elemBefore && <Before>{props.elemBefore}</Before>}
        <ContentWrapper>
          <Content allowMultiline={this.context.shouldAllowMultilineItems}>
            {props.children}
          </Content>
          {!!props.description && (
            <Description>{props.description}</Description>
          )}
        </ContentWrapper>
        {!!props.elemAfter && <After>{props.elemAfter}</After>}
      </Element>
    );

    return (
      <span role="presentation">
        {props.tooltipDescription ? (
          <Tooltip
            content={props.tooltipDescription}
            position={props.tooltipPosition}
          >
            {element}
          </Tooltip>
        ) : (
          element
        )}
      </span>
    );
  }
}

export { Item as DroplistItemWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'droplistItem',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onActivate: createAndFireEventOnAtlaskit({
      action: 'selected',
      actionSubject: 'droplistItem',

      attributes: {
        componentName: 'droplistItem',
        packageName,
        packageVersion,
      },
    }),
  })(Item),
);
