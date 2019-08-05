// @flow

type ValidateSignature = (value: any) => string | null;
type InitialValueSignature = () => any;
type HasValueSignature = (value: any) => boolean;

export default class FieldController {
  constructor(config: Object) {
    this.config = config;
    this.key = config.key;
    this.label = config.label;
    this.type = config.type;
    this.validate = config.validate || this.defaultValidate;

    if (!this.label) {
      throw Error(`"${this.key}" requires a label.`);
    }
  }

  config: Object;

  key: string;

  label: string;

  validate: ValidateSignature;

  type: {
    controller: Object,
    name: string,
    view: Object,
  };

  hasValue: HasValueSignature = () => {
    throw Error(
      `Missing \`hasValue\` method in the "${this.type.name}" controller.`,
    );
  };

  getInitialValue: InitialValueSignature = () => {
    throw Error(
      `Missing \`getInitialValue\` method in the "${
        this.type.name
      }" controller.`,
    );
  };

  defaultValidate: ValidateSignature = () => null;
}
