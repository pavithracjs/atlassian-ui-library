//@flow

import * as React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

export default md`
${(
  <>
    <div style={{ marginBottom: '0.5rem' }}>
      <AtlassianInternalWarning />
    </div>
    <div style={{ marginTop: '0.5rem' }}>
      <DevPreviewWarning />
    </div>
  </>
)}

## Usage

${code`
  import RefinementBar, { SearchFilter } from '@atlaskit/refinement-bar';
`}

${(
  <Example
    packageName="@atlaskit/refinement-bar"
    Component={require('../examples/00-basic-usage').default}
    source={require('!!raw-loader!../examples/00-basic-usage')}
    title="Basic Usage"
  />
)}

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../src/components/RefinementBar')}
    overrides={{
      createAnalyticsEvent: () => null,
    }}
  />
)}

## Implementation

Because you will likely need the logic and the render target at different levels
of your react tree the refinement bar can be consumed in a variety of ways.

The default export is a combination of the provider and the interface, which
accepts both the props required by \`RefinementBarProvider\` and
\`RefinementBarUI\`.

### Refinement Bar Provider

Declare the refinement bar provider as high in the tree as necessary for your
consumer's to have access. More details available in the [reference
docs](/packages/jira/refinement-bar/docs/reference).

${code`
type ProviderProps = {
  fieldConfig: Object,
  irremovableKeys: Array<string>,
  onChange: (value: Object, meta: Object) => void,
  value: Array<any>,
}
`}

### Refinement Bar UI

The interface component must be a descendent of the provider, other than that it
has no requirements. Consider the refinement bar UI a "slot" or "placeholder" to
render the various filters.

${code`
type InterfaceProps = {
  activePopupKey?: string | null,
  onPopupOpen?: (key: string) => void,
  onPopupClose?: () => void,
  refs?: Object,
}
`}

### Refinement Bar Context

The context object can be accessed in a few ways depending on your
implementation's particular constraints and requirements.

${code`
type FieldKey = string;
type FieldKeys = Array<FieldKey>;
type FieldValue = any;

type ContextType = {
  fieldConfig: { [FieldKey]: Object },
  fieldKeys: FieldKeys,
  irremovableKeys: FieldKeys,
  onChange: Function,
  removeableKeys: FieldKeys,
  selectedKeys: FieldKeys,
  value: { [FieldKey]: FieldValue },
  valueKeys: FieldKeys,
}
`}

#### In a Class

${code`
import { RefinementBarContext } from '@atlaskit/refinement-bar'

class App extends React.Component {
  static contextType = RefinementBarContext

  render() {
    const refinementBarContext = this.context

    return (...)
  }
}
`}

#### As a Hook

${code`
import { useRefinementBar } from '@atlaskit/refinement-bar'

function App() {
  const refinementBarContext = useRefinementBar()

  return (...)
}
`}

#### As a Render Prop

${code`
import { RefinementBarConsumer } from '@atlaskit/refinement-bar'

function App() {
  return (
    <RefinementBarConsumer>
      {refinementBarContext => (...)}
    </RefinementBarConsumer>
  )
}
`}

## Fields

The documentation for field types are over in the [reference
docs](/packages/jira/refinement-bar/docs/reference), links below. If you'd like
to implement a custom field type, check out the [concept
docs](/packages/jira/refinement-bar/docs/concepts).

- [AsyncSelect](/packages/jira/refinement-bar/docs/reference#fields-AsyncSelect)
- [AvatarSelect](/packages/jira/refinement-bar/docs/reference#fields-AvatarSelect)
- [AvatarAsyncSelect](/packages/jira/refinement-bar/docs/reference#fields-AvatarAsyncSelect)
- [IssueSelect](/packages/jira/refinement-bar/docs/reference#fields-IssueSelect)
- [IssueAsyncSelect](/packages/jira/refinement-bar/docs/reference#fields-IssueAsyncSelect)
- [Number](/packages/jira/refinement-bar/docs/reference#fields-Number)
- [Select](/packages/jira/refinement-bar/docs/reference#fields-Select)
- [Search](/packages/jira/refinement-bar/docs/reference#fields-Search)
- [Text](/packages/jira/refinement-bar/docs/reference#fields-Text)
`;
