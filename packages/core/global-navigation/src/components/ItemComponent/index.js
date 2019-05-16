// @flow

import React, {
  Component,
  createRef,
  type ComponentType,
  type ElementRef,
  type Node,
} from 'react';
import { DropdownMenuStateless } from '@atlaskit/dropdown-menu';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { GlobalItem } from '@atlaskit/navigation-next';

import type { GlobalNavItemData } from '../../config/types';

type DropdownItemProps = {
  items: Node,
  trigger: ComponentType<{ isOpen: boolean }>,
};
type DropdownItemState = { isOpen: boolean };
class DropdownItem extends Component<DropdownItemProps, DropdownItemState> {
  state = {
    isOpen: false,
  };

  handleOpenChange = ({ isOpen }) => this.setState({ isOpen });

  render() {
    const { items, trigger: Trigger } = this.props;
    const { isOpen } = this.state;

    return (
      <DropdownMenuStateless
        appearance="tall"
        boundariesElement="window"
        isOpen={isOpen}
        onOpenChange={this.handleOpenChange}
        position="right bottom"
        trigger={<Trigger isOpen={isOpen} />}
      >
        {items}
      </DropdownMenuStateless>
    );
  }
}

const ItemComponent = (props: GlobalNavItemData) => {
  const {
    dropdownItems: DropdownItems,
    itemComponent: CustomItemComponent,
    badgeCount,
    ...itemProps
  } = props;
  if (CustomItemComponent) {
    return <CustomItemComponent {...itemProps} />;
  }
  if (DropdownItems) {
    return (
      <DropdownItem
        trigger={({ isOpen }) => (
          <GlobalItem isSelected={isOpen} {...itemProps} />
        )}
        items={<DropdownItems />}
      />
    );
  }

  if (badgeCount !== undefined) {
    return (
      <NavigationAnalyticsContext
        data={{
          attributes: {
            badgeCount,
          },
        }}
      >
        <GlobalItem {...itemProps} />
      </NavigationAnalyticsContext>
    );
  }

  return <GlobalItem {...itemProps} />;
};

type NonStringRef<T> = { current: ElementRef<T> | null };
type ItemComponentWithRefProps = {
  getRef?: (NonStringRef<'span'>) => void,
  ref?: NonStringRef<'span'>,
};

// eslint-disable-next-line react/no-multi-comp
export default class ItemComponentWithRef extends Component<ItemComponentWithRefProps> {
  // TODO: Try to refractor this component to a React Functional Component
  // using React.forwardRef
  node = createRef();

  componentDidMount() {
    this.publishRef();
  }

  componentDidUpdate() {
    this.publishRef();
  }

  publishRef() {
    const { getRef } = this.props;
    if (typeof getRef === 'function') {
      getRef(this.node);
    }
  }

  render() {
    const { ref, ...itemProps } = this.props;
    return (
      <span ref={this.node}>
        <ItemComponent {...itemProps} />
      </span>
    );
  }
}
