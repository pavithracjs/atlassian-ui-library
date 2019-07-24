import { ACTION, ACTION_SUBJECT, AEP, EVENT_TYPE } from './enums';

export enum PLATFORM {
  NATIVE = 'mobileNative',
  HYBRID = 'mobileHybrid',
  WEB = 'web',
}

type RendererStartAEP = AEP<
  ACTION.STARTED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  { platform: PLATFORM.WEB },
  EVENT_TYPE.UI
>;

type RendererRenderedAEP = AEP<
  ACTION.RENDERED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    platform: PLATFORM.WEB;
    duration: number;
    ttfb?: number;
    nodes: Record<string, number>;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type AnalyticsEventPayload = RendererStartAEP | RendererRenderedAEP;
