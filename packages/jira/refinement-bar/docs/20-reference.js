// @noflow

import React from 'react';
import { code, Example, md } from '@atlaskit/docs';

export default md`
This documentation attempts to provide further detail on the various properties
and components that combine to make the refinement bar.

* [Props](#props)
  * [fieldConfig](#props-fieldConfig)
  * [irremovableKeys](#props-irremovableKeys)
  * [onChange](#props-onChange)
  * [value](#props-value)
* [Fields](#fields)
  * [Select](#fields-Select)
  * [AvatarSelect](#fields-AvatarSelect)
  * [IssueSelect](#fields-IssueSelect)
  * [AsyncSelect](#fields-AsyncSelect)
  * [LozengeAsyncSelect](#fields-LozengeAsyncSelect)
  * [AvatarAsyncSelect](#fields-AvatarAsyncSelect)
  * [IssueAsyncSelect](#fields-IssueAsyncSelect)
  * [Number](#fields-Number)
  * [Text](#fields-Text)
  * [Search](#fields-Search)

<a name="props"></a>
## Props

<a name="props-fieldConfig"></a>
### \`fieldConfig\`

The configuration object for each field that may be rendered in the refinement
bar. A simple config may look something like:

${code`
import { SearchFilter, TextFilter } from '@atlaskit/refinement-bar';

export const fieldConfig = {
  search: {
    label: 'Search',
    type: SearchFilter
  },
  browser: {
    label: 'Browser',
    type: TextFilter,
    note: 'The browser(s) in which this issue is reproducible.',
  },
}
`}

<a name="props-irremovableKeys"></a>
### \`irremovableKeys\`

The array of keys representing which fields may not be removed from the
refinement bar by the user. Fields in this list will be rendered before (to the
left of) any other fields. They will not appear in the "+ more" dropdown menu
and they will not be hidden if the user collapses the filters via the "Show
Less" button.

<a name="props-onChange"></a>
### \`onChange\`

The function that's called when a change happens in the refinement bar. A call
to \`onChange\` will happen when one of the following takes place:

- A field is **added** to the refinement bar
- A field is **removed** from the refinement bar
- A field is **updated** in the refinement bar
- A field is **cleared** in the refinement bar

This function takes two arguments \`value\` and \`meta\`, where value is an
updated value object for the refinement bar and meta is some information about
the type of change.

${code`
type FieldValue = any
type Value = {
  [FieldKey]: FieldValue,
}

type Meta = {
  type: 'add' | 'remove' | 'update' | 'clear',
  key: FieldKey,
  data?: FieldValue,
}

type OnChange = (Value, Meta) => void
`}

Go to the ["change meta"](/packages/jira/refinement-bar/example/change-meta)
example to see this in action.

<a name="props-value"></a>
### \`value\`

The object representing the value of fields.

For a field to be rendered in the refinement bar its key must be present in
either \`irremovableKeys\` or in the \`value\` object.

<a name="fields"></a>
## Fields

Field definitions expect a minimum of \`label\` and \`type\`, but may require or
support further configuration.

${code`
type DefaultConfig = {
  label: string,
  type: $React.ComponentType<*>,
}
`}

<a name="fields-Select"></a>
### Select

The select filter renders a searchable list of options. Each option expects a
\`label\` and \`value\`, but can contain any other data required.

By providing a function to \`options\` you can access the current value of each
field in the refinement bar. The function must return an array of options.

Once the user has selected one or more options, the selected options will be
pinned to the top of the options list. The pinned section has a special "Clear
selected items" option appended.

${code`
type Option = { value: any, label: string }
type Options = Array<Option>

type SelectFieldConfig = DefaultConfig & {
  onMenuScrollToBottom?: (event: WheelEvent) => void,
  onMenuScrollToTop?: (event: WheelEvent) => void,
  options: Options | (refinementBarValue: Object) => Options,
  placeholder?: string, // Default "Search..."
}

type SelectFieldValue = Options
`}

${(
  <Example
    Component={require('../examples/90-select-filter-config-reference').default}
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/90-select-filter-config-reference')}
    title="Select filter config reference"
  />
)}

<a name="fields-AvatarSelect"></a>
### AvatarSelect

The \`AvatarSelect\` filter extends the \`Select\` filter. The only difference
being how options are rendered, which requires the shape of \`Option\` to
include \`avatar\`, a URL string:

${code`
type Option = { value: any, label: string, avatar: string }
`}

${(
  <Example
    Component={
      require('../examples/91-avatar-select-filter-config-reference').default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/91-avatar-select-filter-config-reference')}
    title="AvatarSelect filter config reference"
  />
)}

<a name="fields-IssueSelect"></a>
### IssueSelect

The \`IssueSelect\` filter extends the \`Select\` filter. The only difference
being how options are rendered, which requires the shape of \`Option\` to
include \`type\`, an enumerable:

${code`
type IssueType = 'blog' | 'branch' | 'bug' | 'calendar' | 'changes' | 'code' | 'commit' | 'epic' | 'improvement' | 'incident' | 'issue' | 'page' | 'problem' | 'question' | 'story' | 'subtask' | 'task' | 'new-feature' | 'pull-request'
type Option = { value: any, label: string, type: IssueType }
`}

${(
  <Example
    Component={
      require('../examples/92-issue-select-filter-config-reference').default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/92-issue-select-filter-config-reference')}
    title="IssueSelect filter config reference"
  />
)}

<a name="fields-AsyncSelect"></a>
### AsyncSelect

The \`AsyncSelect\` filter extends the \`Select\` filter, so any config available
for the select filter is also available on the async variant.

Whilst not required, it's recommended to provide static \`defaultOptions\` so
that your users don't see a "No matches found" message before they start typing.

If \`cacheOptions\` is truthy, then the loaded data will be cached. The cache
will remain until \`cacheOptions\` changes value.

The \`loadOptions\` function returns a promise, which is the set of options to
be used once the promise resolves.

The \`defaultOptions\` property when given a boolean \`true\` will call the function
given to \`loadOptions\` when the user interacts, and display the resultant data.

${code`
type AsyncSelectFieldConfig = SelectFieldConfig & {
  cacheOptions?: any,
  defaultOptions?: Options | boolean,
  defaultOptionsLabel?: string,
  inputValue?: string,
  loadOptions: (inputValue: string) => Options,
  onInputChange?: Function,
}
`}

${(
  <Example
    Component={
      require('../examples/93-async-select-filter-config-reference').default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/93-async-select-filter-config-reference')}
    title="AsyncSelect filter config reference"
  />
)}

<a name="fields-AvatarAsyncSelect"></a>
### AvatarAsyncSelect

The \`AvatarAsyncSelect\` filter extends the \`AsyncSelect\` filter. The only
difference being how options are rendered, which requires the shape of
\`Option\` to include \`avatar\`, a URL string:

${code`
type Option = { value: any, label: string, avatar: string }
`}

${(
  <Example
    Component={
      require('../examples/94-avatar-async-select-filter-config-reference')
        .default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/94-avatar-async-select-filter-config-reference')}
    title="AvatarAsyncSelect filter config reference"
  />
)}

<a name="fields-IssueAsyncSelect"></a>
### IssueAsyncSelect

The \`IssueAsyncSelect\` filter extends the \`AsyncSelect\` filter. The only difference
being how options are rendered, which requires the shape of \`Option\` to
include \`type\`, an enumerable:

${code`
type IssueType = 'blog' | 'branch' | 'bug' | 'calendar' | 'changes' | 'code' | 'commit' | 'epic' | 'improvement' | 'incident' | 'issue' | 'page' | 'problem' | 'question' | 'story' | 'subtask' | 'task' | 'new-feature' | 'pull-request'
type Option = { value: any, label: string, type: IssueType }
`}

${(
  <Example
    Component={
      require('../examples/95-issue-async-select-filter-config-reference')
        .default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/95-issue-async-select-filter-config-reference')}
    title="IssueAsyncSelect filter config reference"
  />
)}

<a name="fields-LozengeAsyncSelect"></a>
### LozengeAsyncSelect

The \`LozengeAsyncSelect\` filter extends the \`AsyncSelect\` filter. Instead of rendering values as text, it renders them
inside the [Lozenge component](/packages/core/lozenge) component and extends its \`fieldConfig\` to include props accepted by the Lozenge.

For the extended prop list, please see the [Lozenge component](/packages/core/lozenge). All other props are indentical
to the \`AsyncSelect\` filter.

${(
  <Example
    Component={
      require('../examples/99-lozenge-async-select-filter-config-reference')
        .default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/99-lozenge-async-select-filter-config-reference')}
    title="LozengeAsyncSelect filter config reference"
  />
)}

<a name="fields-Number"></a>
### Number

The number filter, in addition to the default config also accepts (optionally) \`validate\`
for custom validation, and a \`note\` to be rendered beneath the filter UI.

${code`
type Type = 'is' | 'not' | 'gt' | 'lt' | 'between' | 'is_not_set'
type Value = { gt: number, lt: number } | number | null

type ValidateSignature = (value: NumberFieldValue) => string | null

type NumberFieldConfig = {
  label: string,
  note?: string,
  type: NumberFilter,
  validate?: ValidateSignature,
}

type NumberFieldValue = {
  type: Type,
  value: Value,
}
`}

The number filter's value can be of 6 different \`types\`, with slight variants
amongst the value shape:

- \`'is'\` where the value is \`number\`
- \`'not'\` where the value is \`number\`
- \`'gt'\` where the value is \`number\`
- \`'lt'\` where the value is \`number\`
- \`'between'\` where the value is \`{ gt: number, lt: number }\`
- \`'is_not_set'\` where the value is \`null\`

The number filter has quite strict default validation, and will fail if:

- the value provided is not a number
- the number is negative e.g. \`-9\`
- the number is not "whole" e.g. \`2.4\`
- when between, the second number is less than first e.g. \`9 -- 2\`

${(
  <Example
    Component={require('../examples/96-number-filter-config-reference').default}
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/96-number-filter-config-reference')}
    title="Number filter config reference"
  />
)}

<a name="fields-Text"></a>
### Text

The text filter, in addition to the default config also accepts (optionally) \`validate\`
for custom validation, and a \`note\` to be rendered beneath the filter UI.

${code`
type Type = 'contains' | 'not_contains' | 'is' | 'is_not_set'
type Value = string | null

type ValidateSignature = (value: TextFieldValue) => string | null

type TextFieldConfig = {
  label: string,
  note?: string,
  type: TextFilter,
  validate?: ValidateSignature,
}

type TextFieldValue = {
  type: Type,
  value: Value,
}
`}

The text filter's value can be of 4 different \`types\`, with slight variants
amongst the value shape:

- \`'contains'\` where the value is \`string\`
- \`'not_contains'\` where the value is \`string\`
- \`'is'\` where the value is \`string\`
- \`'is_not_set'\` where the value is \`null\`

The config reference below implements a custom validate function. Try beginning
your search string with either \`'*'\` or \`'?'\`.

${(
  <Example
    Component={require('../examples/97-text-filter-config-reference').default}
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/97-text-filter-config-reference')}
    title="Text filter config reference"
  />
)}

<a name="fields-Search"></a>
### Search

The search filter has no additional config beyond the default.

${code`
type SearchFieldConfig = {
  label: string,
  type: SearchFilter,
}

type SearchFieldValue = string
`}

${(
  <Example
    Component={require('../examples/98-search-filter-config-reference').default}
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/98-search-filter-config-reference')}
    title="Search filter config reference"
  />
)}

`;
