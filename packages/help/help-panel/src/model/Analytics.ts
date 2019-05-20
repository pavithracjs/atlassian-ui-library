export interface Analytics {
  createAnalyticsEvent(
    event: object,
  ): {
    update: (attributes: object) => void;
    fire: (channel: string) => void;
    attributes: object;
  };
}
