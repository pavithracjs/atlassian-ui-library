// @flow

type validateFnType = (
  value: Object,
) => { message: string | null, isInvalid: boolean };
type initialFnType = (value: Object) => any;

export default class FieldController {
  constructor(config: *) {
    this.config = config;
    this.key = config.key;
    this.label = config.label;
    this.note = config.note;
    this.type = config.type;
    this.validateValue = config.validateValue || this.defaultValidation;

    if (!this.label) {
      throw new Error(`"${this.key}" requires a label.`);
    }
  }

  validateValue: validateFnType;

  config: Object;

  key: string;

  label: string;

  note: string;

  type: string;

  hasValue = ({ value }: Object) => Boolean(value);

  getValue = (data: Object) => data[this.config.key] || '';

  getInitialValue: initialFnType = () => '';

  defaultValidation: validateFnType = () => ({
    message: null,
    isInvalid: false,
  });
}
