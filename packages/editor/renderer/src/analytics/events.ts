import { SortOrder } from '@atlaskit/editor-common';
import { ACTION, ACTION_SUBJECT, AEP, EVENT_TYPE } from './enums';

export enum PLATFORM {
  NATIVE = 'mobileNative',
  HYBRID = 'mobileHybrid',
  WEB = 'web',
}

export enum MODE {
  RENDERER = 'renderer',
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

type TableSortColumnNotAllowedAEP = AEP<
  ACTION.SORT_COLUMN_NOT_ALLOWED,
  ACTION_SUBJECT.TABLE,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  },
  EVENT_TYPE.TRACK
>;

type TableSortColumnAEP = AEP<
  ACTION.SORT_COLUMN,
  ACTION_SUBJECT.TABLE,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
    sortOrder: SortOrder;
    columnIndex: number;
  },
  EVENT_TYPE.TRACK
>;

export type AnalyticsEventPayload =
  | RendererStartAEP
  | RendererRenderedAEP
  | TableSortColumnNotAllowedAEP
  | TableSortColumnAEP;
