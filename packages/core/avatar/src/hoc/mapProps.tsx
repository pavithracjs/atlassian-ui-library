// TODO: Replace with hooks
// @flow
import React, {
  Component,
  ComponentType,
} from 'react';
import { getDisplayName } from '../utils';

export default function mapProps(mapping: { [key: string]: any }) {
  return <Props:object, WrappedComponent : ComponentType<Props>>(
    DecoratedComponent: WrappedComponent
  ): ComponentType<ElementConfig<WrappedComponent>> =>
    class MapProps extends Component<any> {
      static displayName: string | void | null = getDisplayName(
        'mapProps',
        DecoratedComponent,
      );

      static DecoratedComponent = DecoratedComponent;

      component?: React.Element;

      // expose blur/focus to consumers via ref
      blur = () => {
        if (this.component && this.component.blur) this.component.blur();
      };

      focus = () => {
        if (this.component && this.component.focus) this.component.focus();
      };

      setComponent = (component: ?ElementRef<*>) => {
        this.component = component;
      };

      render() {
        const mapped: { [string]: any } = {
          ...this.props,
          ...Object.keys(mapping).reduce(
            (acc, key) => ({
              ...acc,
              [key]: mapping[key](this.props),
            }),
            {},
          ),
        };

        return <DecoratedComponent ref={this.setComponent} {...mapped} />;
      }
    };
}
