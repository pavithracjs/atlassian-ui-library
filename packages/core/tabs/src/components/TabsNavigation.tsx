import React, { Component, KeyboardEvent } from 'react';
import { Nav, NavLine, NavWrapper } from '../styled';
import { TabData, TabsNavigationProps } from '../types';

export default class TabsNavigation extends Component<TabsNavigationProps> {
  elementRefs: Array<HTMLElement> = [];

  componentWillReceiveProps(newProps: TabsNavigationProps) {
    if (newProps.tabs !== this.props.tabs) {
      this.elementRefs = [];
    }
  }

  tabKeyDownHandler = (e: KeyboardEvent<HTMLElement>) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      return;
    }

    const { selected, tabs } = this.props;
    const modifier = e.key === 'ArrowRight' ? 1 : -1;
    const newselectedIndex = tabs.indexOf(selected) + modifier;

    if (newselectedIndex < 0 || newselectedIndex >= tabs.length) {
      return;
    }

    this.onSelect(tabs[newselectedIndex], newselectedIndex);
    this.elementRefs[newselectedIndex].focus();
  };

  /* 
    For some reason MouseEvent throws an typecheck error because it's private.
    Looks like a TS bug, maybe we should try removing the comment after we upgrade TypeScript.
    Error:
    
    src/components/TabsNavigation.tsx:1:43 - error TS6133: 'MouseEvent' is declared but its value is never read.

    1 import React, { Component, KeyboardEvent, MouseEvent } from 'react';
                                                ~~~~~~~~~~


    */
  tabMouseDownHandler = (
    e: { preventDefault: () => void } /*MouseEvent<HTMLElement>*/,
  ) => e.preventDefault();

  onSelect = (selected: TabData, selectedIndex: number) => {
    this.props.onSelect(selected, selectedIndex);
  };

  render() {
    const { selected, component: Item, tabs } = this.props;

    return (
      <NavWrapper>
        <NavLine status="normal" />
        <Nav role="tablist">
          {tabs.map((tab, index) => {
            const isSelected = tab === selected;
            const elementProps = {
              'aria-posinset': index + 1,
              'aria-selected': isSelected,
              'aria-setsize': tabs.length,
              onClick: () => this.onSelect(tab, index),
              onKeyDown: this.tabKeyDownHandler,
              onMouseDown: this.tabMouseDownHandler,
              role: 'tab',
              tabIndex: isSelected ? 0 : -1,
            };
            const innerRef = (ref: HTMLElement) => {
              this.elementRefs[index] = ref;
            };

            const itemProps = {
              elementProps,
              innerRef,
              data: tab,
              isSelected,
            };

            // eslint-disable-next-line react/no-array-index-key
            return <Item key={index} {...itemProps} />;
          })}
        </Nav>
      </NavWrapper>
    );
  }
}
