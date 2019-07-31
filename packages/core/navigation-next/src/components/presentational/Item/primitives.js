// @flow

import React, { Component, type ElementType, type Ref } from 'react';

import deepEqual from 'react-fast-compare';
import type { Dataset, ItemPrimitiveProps } from './types';
import { styleReducerNoOp, withContentTheme } from '../../../theme';

const isString = x => typeof x === 'string';

type SwitchProps = {
  as: ElementType,
  dataset: Dataset,
  draggableProps: {},
  innerRef: Ref<*>,
};
const ComponentSwitch = ({
  as,
  dataset,
  draggableProps,
  innerRef,
  ...rest
}: SwitchProps) => {
  const isElement = isString(as);
  const props = isElement
    ? { ...dataset, ...rest }
    : { innerRef, dataset, draggableProps, ...rest };
  // only pass the actual `ref` to an element, it's the responsibility of the
  // component author to use `innerRef` where applicable
  const ref = isElement ? innerRef : null;
  const ElementOrComponent = as;

  return <ElementOrComponent ref={ref} {...draggableProps} {...props} />;
};

const getItemComponentProps = (props: ItemPrimitiveProps) => {
  const nonComponentKeys = [
    'isActive',
    'isHover',
    'isSelected',
    'isFocused',
    'isDragging',
    'theme',
  ];
  const componentProps = {};
  Object.keys(props).forEach(prop => {
    if (!nonComponentKeys.includes(prop)) {
      componentProps[prop] = props[prop];
    }
  });

  return componentProps;
};

class ItemPrimitive extends Component<ItemPrimitiveProps> {
  static defaultProps = {
    dataset: {
      'data-testid': 'NavigationItem',
    },
    isActive: false,
    isDragging: false,
    isHover: false,
    isSelected: false,
    isFocused: false,
    spacing: 'default',
    styles: styleReducerNoOp,
    text: '',
  };

  shouldComponentUpdate(nextProps: ItemPrimitiveProps) {
    return !deepEqual(this.props, nextProps);
  }

  render() {
    const {
      after: After,
      before: Before,
      component: CustomComponent,
      dataset,
      draggableProps,
      href,
      innerRef,
      isActive,
      isDragging,
      isHover,
      isSelected,
      isFocused,
      onClick,
      spacing,
      styles: styleReducer,
      subText,
      target,
      text,
      theme,
    } = this.props;
    const { mode, context } = theme;
    const presentationProps = {
      isActive,
      isDragging,
      isHover,
      isSelected,
      isFocused,
      spacing,
    };
    const defaultStyles = mode.item(presentationProps)[context];
    const styles = styleReducer(defaultStyles, presentationProps, theme);
    // base element switch

    let itemComponent = 'div';
    let itemProps = { draggableProps, innerRef, dataset };

    // $FlowFixMe Will revisit on the TS re-write
    const { afterGoTo, spinnerDelay, incomingView } = this.props;
    const propsForAfterComp = {
      afterGoTo,
      spinnerDelay,
      incomingView,
    };

    if (CustomComponent) {
      itemComponent = CustomComponent;
      itemProps = getItemComponentProps(this.props);
    } else if (href) {
      itemComponent = 'a';
      itemProps = {
        dataset,
        href,
        onClick,
        target,
        draggableProps,
        innerRef,
      };
    } else if (onClick) {
      itemComponent = 'button';
      itemProps = { dataset, onClick, draggableProps, innerRef };
    }

    return (
      <ComponentSwitch
        as={itemComponent}
        css={{ '&&': styles.itemBase }}
        {...itemProps}
      >
        {!!Before && (
          <div css={styles.beforeWrapper}>
            <Before {...presentationProps} />
          </div>
        )}
        <div css={styles.contentWrapper}>
          <div css={styles.textWrapper}>{text}</div>
          {!!subText && <div css={styles.subTextWrapper}>{subText}</div>}
        </div>
        {!!After && (
          <div css={styles.afterWrapper}>
            <After {...presentationProps} {...propsForAfterComp} />
          </div>
        )}
      </ComponentSwitch>
    );
  }
}

export { ItemPrimitive as ItemPrimitiveBase };
export default withContentTheme(ItemPrimitive);
