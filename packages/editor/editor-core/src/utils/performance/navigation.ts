export function getResponseEndTime(): number | undefined {
  if (!('performance' in window)) {
    return;
  }

  const nav = performance.getEntriesByType(
    'navigation',
  )[0] as PerformanceNavigationTiming;

  if (nav) {
    return nav.responseEnd;
  }

  return;
}
