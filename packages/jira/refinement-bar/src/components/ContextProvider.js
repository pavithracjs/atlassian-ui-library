// @flow

import React, { Component, type ComponentType, type Node } from 'react';

import { diffArr, objectMap } from '../utils';

export const RefinementBarContext = React.createContext({});

type FieldKey = string;
type FieldType = {
  label: string,
  type: ComponentType<*>,
};
type FieldConfigType = { [FieldKey]: FieldType };
type Meta = {
  type: 'add' | 'remove' | 'update',
  key: FieldKey,
  data?: any,
};

export type CommonProps = {
  /** All fields that may be rendered in the refinement bar. */
  fieldConfig: FieldConfigType,
  /** All fields that may be rendered in the refinement bar. */
  irremovableKeys: Array<FieldKey>,
  /** Handle what happens when one of the field's values changes. */
  onChange: (value: Object, meta: Meta) => void,
  /** The current value of each field in the refinement bar. */
  value: Object,
};
type ProviderProps = CommonProps & {
  children?: Node,
};
type State = {
  fieldConfig: FieldConfigType,
};

export class RefinementBarProvider extends Component<ProviderProps, State> {
  static defaultProps = {
    irremovableKeys: [],
  };

  constructor(props: ProviderProps) {
    super(props);
    const { fieldConfig } = this.props;

    // NOTE: this is the primary responsibility of the provider; to initialize
    // each field with its corresponding controller
    const initializedFields = objectMap(fieldConfig, (field, key) => {
      const Controller = field.type.controller;
      return new Controller({ key, ...field });
    });

    this.state = {
      fieldConfig: initializedFields,
    };
  }

  get removeableKeys() {
    const all = Object.keys(this.props.fieldConfig);
    const irremovable = this.props.irremovableKeys;
    return diffArr(all, irremovable);
  }

  get selectedKeys() {
    const values = Object.keys(this.props.value);
    const irremovable = this.props.irremovableKeys;
    return diffArr(values, irremovable);
  }

  render() {
    const context = {
      fieldConfig: this.state.fieldConfig,
      irremovableKeys: this.props.irremovableKeys,
      onChange: this.props.onChange,
      removeableKeys: this.removeableKeys,
      selectedKeys: this.selectedKeys,
      value: this.props.value,
    };

    return (
      <RefinementBarContext.Provider value={context}>
        {this.props.children}
      </RefinementBarContext.Provider>
    );
  }
}

export const RefinementBarConsumer = ({
  children,
}: {
  children: Object => Node,
}) => (
  <RefinementBarContext.Consumer>
    {ctx => children(ctx)}
  </RefinementBarContext.Consumer>
);

export const useRefinementBar = () => React.useContext(RefinementBarContext);
