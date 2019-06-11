import { md } from '@atlaskit/docs';

export default md`
## Notes for contributers (Atlassian internal)

### Concepts & design

- https://product-fabric.atlassian.net/wiki/spaces/FS/pages/840564849/
- https://product-fabric.atlassian.net/wiki/spaces/FS/pages/856852513/

### SSR

With SSR rendering, \`window\` is not available, hence some \`window\` checks here and there.

To test SSR in JIRA, see \`services/jira-frontend-ssr/README.md\`.

## Decisions

### Should origin Id be regenerated on each click on "copy"?

Clicking the “copy” button is not really a share action, the share happens when the url is pasted somewhere…
Since we have no control over the actual share action, it shouldn’t be needed to re-generate on each “copy” click.

## Quick dev commands

~~~bash
bolt lint
bolt typecheck:typescript
bolt run test ./packages/elements/share/src/__tests__/*
bolt run test ./packages/elements/share/src/__tests__/unit/components/ShareDialogWithTriggerSpec.tsx
~~~
`;
