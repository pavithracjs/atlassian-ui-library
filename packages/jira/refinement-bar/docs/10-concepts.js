// @flow

import { code, md } from '@atlaskit/docs';

export default md`
This documentation attempts to provide further detail on the various concepts behind the refinement bar.

* [Controller](#controller)
  * [formatLabel](#controller-formatLabel)
  * [getInitialValue](#controller-getInitialValue)
  * [hasValue](#controller-hasValue)
  * [validate](#controller-validate)
* [View](#view)
  * [closePopup](#view-closePopup)
  * [field](#view-field)
  * [invalidMessage](#view-invalidMessage)
  * [onChange](#view-onChange)
  * [onClear](#view-onClear)
  * [refinementBarValue](#view-refinementBarValue)
  * [storedValue](#view-storedValue)
  * [value](#view-value)

<a name="controller"></a>
## Controller

The controller consumes \`fieldConfig\`, responds to user input and performs
interactions on the data. The controller receives the input,
validates it and then passes the input to the consumer via the \`value\` object.

Each field type extends the default controller:

${code`
interface Controller<Config> {
  config: Config;
  key: string;
  label: string;

  defaultValidate(value: any): string | null;
  getInitialValue(): any;
  hasValue(value: any): boolean;
  formatLabel?(value: any): $React.Node;
}
`}

<a name="controller-formatLabel"></a>
### \`formatLabel\`

${code`
type FormatLabelSignature = (value: any) => $React.Node
`}

Returns a summary of the field's current value.

By providing this method the \`View\` will be rendered within a popup,
accompanied by the button to invoke it with the returned value as its label.

<a name="controller-getInitialValue"></a>
### \`getInitialValue\`

${code`
type InitialValueSignature = () => any;
`}

Returns the initial value of the field type. Check out the [reference
docs](/packages/jira/refinement-bar/docs/reference#fields) for each field's
value shape.

<a name="controller-hasValue"></a>
### \`hasValue\`

${code`
type HasValueSignature = (value: any) => boolean;
`}

Returns whether or not a given field has value. Let the view know when this
field has a valid value, used for things like formatting the button label.

<a name="controller-validate"></a>
### \`validate\` and \`defaultValidate\`

${code`
type ValidateSignature = (value: any) => string | null
`}

For fields where the user may input data (e.g. \`Number\`, \`Text\`), we need to
be able to render helpful information, indicating to the user what has happened
if their data is invalid.

Each time a field's value changes it is validated. A field should provide a
\`defaultValidate\` method, but also allows the consumer to offer their own via
a \`validate\` property in the field's configuration.

${code`
const FIELD_CONFIG = {
  key: 'Some Field',
  type: SomeFilter,
  validate: value => {
    if (!value) {
      return 'Please enter a value.';
    }

    return null;
  }
}
`}


<a name="view"></a>
## View

A react component. The UI necessary for a user to filter a set of data. Because
of space constraints simple field types (e.g. \`Search\`) may have inline
interfaces. More sophisticated filtering requires two parts:

- A button, containing a summary of the filter's value, which invokes a popup
- The actuall filter UI, which is displayed in the popup

Each view is passed the following props:

${code`
type FieldProps = {
  closePopup?: Function,
  field: Object,
  invalidMessage: string | null,
  onChange: Function,
  onClear: Function,
  refinementBarValue: Object,
  storedValue: any,
  value: any,
}
`}

<a name="view-closePopup"></a>
### \`closePopup\`

${code`
type ClosePopup = Function
`}

Available if the field controller defines a \`formatLabel\` method.

<a name="view-field"></a>
### \`field\`

${code`
type Field = Object
`}

The instantiated class for this field type.

<a name="view-invalidMessage"></a>
### \`invalidMessage\`

${code`
type InvalidMessage = string | null
`}

If a field finds its self in an invalid state the \`storedValue\` will be
preserved in context, whilst the user attempts to resolve the issue. Once
resolved, the new value will be persisted to context.

<a name="view-onChange"></a>
### \`onChange\`

${code`
type FieldKey = string
type FieldValue = any
type RefinementBarValue = {
  [FieldKey]: FieldValue,
}

type Action = {
  type: 'add' | 'remove' | 'update' | 'clear',
  key: FieldKey,
  data?: FieldValue,
}

type OnChange = (RefinementBarValue, Action) => void
`}

Calls the consumer's change handler with the updated value and the action type
of \`'update'\`. Will not get called if there is an \`invalidMessage\` for this
field.

<a name="view-onClear"></a>
### \`onClear\`

${code`
type OnClear = () => void
`}

Calls the field controller's \`getInitialValue\` method to reset the value, then
calls the consumer's \`onChange\` handler with the updated value and the action
type of \`'clear'\`.

<a name="view-refinementBarValue"></a>
### \`refinementBarValue\`

${code`
type FieldKey = string
type FieldValue = any

type RefinementBarValue = {
  [FieldKey]: FieldValue,
}
`}

The value of each field in the refinement bar.

<a name="view-storedValue"></a>
### \`storedValue\`

${code`
type StoredValue = FieldValue
`}

Field values are updated in real time i.e. there's no "apply" button or similar.
The \`storedValue\` is a reference to the last valid value from context.

<a name="view-value"></a>
### \`value\`

${code`
type Value = FieldValue
`}

The current local field value from state, which may be invalid.
`;
