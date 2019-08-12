- Adding entry point for `AnalyticsErrorBoundary` package

```
// How to use

// Import via entry point
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';

// Wrapping your component with the component
class ButtonWithAnalyticsErrorBoundary etends React.Component {
  handleEvent = (analyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', analyticsEvent, { payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <AnalyticsErrorBoundary
          channel="atlaskit"
          data={{
            componentName: 'button',
            packageName: '@atlaskit/button',
            componentVersion: '999.9.9',
          }}
        >
          <Button>Click me</Button>
        </AnalyticsErrorBoundary>
      </AnalyticsListener>
    )
  }
}
```

Notes on new API:

- Plug-and-play component. As soon and it's wrapping a component it's fully integrated.
- It has Analytics context and events integrated already. Keep in mind it requires `AnalyticsListener` as a top level component to work properly, otherwise it won't trigger analytics events.
