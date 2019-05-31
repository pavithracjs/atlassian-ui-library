Currently on the Atlaskit website, we are using section messages for developer preview at several places. In addition, as we recently removed couple of components from the Atlaskit service desk, we need to indicate if the component is intended for Atlassian first. Hence, We added another section message that will warn about the usage.

Now, in your docs, you can directly import those section messages to inform your customers.

## Usage:

- <AtlassianInternalWarning /> is the section message that warns about Atlassian usage.
- <DevPreviewWarning> is the section message that warns about the componenent readiness.

- If you add the two section messages, meaning the component is Atlassian only and in dev preview:
`import { AtlassianInternalWarning, DevPreviewWarning } from '@atlaskit/docs/src/SectionMessages';`

```${(
    <>
    <div style={{ marginBottom: '0.5rem'}}>
    <AtlassianInternalWarning />
    </div>
    <div style={{ marginTop: '0.5rem'}}>
      <DevPreviewWarning />
    </div>
    </>
  )}```

- If you need one component, just import the requested one: `${( <AtlassianInternalWarning />)}`
