// @flow

type ValidationSignature = (value: any) => string | null;
type InitialValueSignature = () => any;
type HasValueSignature = (value: any) => boolean;

export default class FieldController {
  constructor(config: *) {
    this.config = config;
    this.key = config.key;
    this.label = config.label;
    this.type = config.type;
    this.validate = config.validate || this.defaultValidation;

    if (!this.label) {
      throw Error(`"${this.key}" requires a label.`);
    }
  }

  validate: ValidationSignature;

  config: Object;

  key: string;

  label: string;

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

  defaultValidation: ValidationSignature = () => null;
}
