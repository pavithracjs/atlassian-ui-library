TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

Before:

```typescript
withAnalyticsEvents()(
  Button,
) as ComponentClass<Props>;
```

After: 

```typescript
withAnalyticsEvents<Props>()(Button)
```

