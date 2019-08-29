import {
  UIAnalyticsEvent,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';

// First object overrides the second!
// First object tags come first
function mergeObjects(
  payloadA: AnalyticsEventPayload,
  payloadB: AnalyticsEventPayload,
) {
  return {
    ...payloadB,
    ...payloadA,
    ...(payloadA.attributes || payloadB.attributes
      ? {
          attributes: {
            ...(payloadB.attributes || {}),
            ...(payloadA.attributes || {}),
          },
        }
      : {}),
    ...(payloadA.tags || payloadB.tags
      ? { tags: [...(payloadA.tags || []), ...(payloadB.tags || [])] }
      : {}),
  };
}

function reduceContext(
  payload: AnalyticsEventPayload,
  context: AnalyticsEventPayload[],
): AnalyticsEventPayload {
  return context.reduce(
    (
      merged: AnalyticsEventPayload,
      contextData: AnalyticsEventPayload,
    ): AnalyticsEventPayload => {
      if (shareSamePackageName(payload, contextData)) {
        return mergeObjects(contextData, merged);
      } else {
        return merged;
      }
    },
    {},
  );
}

function shareSamePackageName(
  payloadA: AnalyticsEventPayload,
  payloadB: AnalyticsEventPayload,
): boolean {
  const packageNameA = payloadA.attributes && payloadA.attributes.packageName;
  const packageNameB = payloadB.attributes && payloadB.attributes.packageName;
  return packageNameA && packageNameB && packageNameA === packageNameB;
}

export function mergeEventData({
  payload,
  context,
}: UIAnalyticsEvent): AnalyticsEventPayload | void {
  if (!payload) {
    return;
  }
  const reducedContext = reduceContext(payload, context);
  return mergeObjects(payload, reducedContext);
}
