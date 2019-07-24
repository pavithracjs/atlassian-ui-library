// @flow

import React, { Component, type ComponentType, type Node } from 'react';

import { diffArr, objectMap } from '../utils';

export const RefinementBarContext = React.createContext({});

type FieldKey = string;
type FieldKeys = Array<FieldKey>;
type FieldType = {
  label: string,
  type: ComponentType<*>,
};
type FieldConfigType = { [FieldKey]: FieldType };
type Meta = {
  type: 'add' | 'clear' | 'remove' | 'update',
  key: FieldKey,
  data?: any,
};

export type ValuesType = { [FieldKey]: any };
export type CommonProps = {
  /** The configuration object for each field that may be rendered in the refinement bar. */
  fieldConfig: FieldConfigType,
  /** Which fields, if any, may not be removed from the refinement-bar by the user. */
  irremovableKeys: FieldKeys,
  /** Handle what happens when one of the field's values changes. */
  onChange: (value: Object, meta: Meta) => void,
  /** The current value of each field in the refinement bar. */
  value: ValuesType,
};
export type ProviderContext = {
  ...CommonProps,
  fieldKeys: FieldKeys,
  removeableKeys: FieldKeys,
  selectedKeys: FieldKeys,
  valueKeys: FieldKeys,
};
type ProviderProps = CommonProps & {
  children?: Node,
};
type ProviderState = {
  fieldConfig: FieldConfigType,
};

export class RefinementBarProvider extends Component<
  ProviderProps,
  ProviderState,
> {
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

  get fieldKeys(): FieldKeys {
    return Object.keys(this.props.fieldConfig);
  }

  get valueKeys(): FieldKeys {
    return Object.keys(this.props.value);
  }

  get removeableKeys(): FieldKeys {
    const irremovable = this.props.irremovableKeys;
    return diffArr(this.fieldKeys, irremovable);
  }

  get selectedKeys(): FieldKeys {
    const irremovable = this.props.irremovableKeys;
    return diffArr(this.valueKeys, irremovable);
  }

  render() {
    const context = {
      fieldConfig: this.state.fieldConfig,
      fieldKeys: this.fieldKeys,
      irremovableKeys: this.props.irremovableKeys,
      onChange: this.props.onChange,
      removeableKeys: this.removeableKeys,
      selectedKeys: this.selectedKeys,
      value: this.props.value,
      valueKeys: this.valueKeys,
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

// $FlowFixMe useContext
export const useRefinementBar = () => React.useContext(RefinementBarContext);
