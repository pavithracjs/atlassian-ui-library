import SchemaNode from './schema-node';
import ts from 'typescript';

export type EnumTypes = string | number | boolean | ts.PseudoBigInt;

export default class EnumSchemaNode extends SchemaNode {
  values: Set<EnumTypes>;

  constructor(values: EnumTypes | Array<EnumTypes>) {
    super();
    this.values = new Set(Array.isArray(values) ? values : [values]);
  }

  toJSON(): object {
    return { enum: Array.from(this.values) };
  }

  toSpec() {
    return {
      type: 'enum',
      values: Array.from(this.values),
    };
  }
}
