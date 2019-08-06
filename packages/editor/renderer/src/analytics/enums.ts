export enum EVENT_TYPE {
  OPERATIONAL = 'operational',
  SCREEN = 'screen',
  TRACK = 'track',
  UI = 'ui',
}

export enum ACTION {
  STARTED = 'started',
  RENDERED = 'rendered',
  CLICKED = 'clicked',
}

export enum ACTION_SUBJECT {
  RENDERER = 'renderer',
  BUTTON = 'button',
}

export enum ACTION_SUBJECT_ID {
  HEADING_ANCHOR_LINK = 'headingAnchorLink',
}

export type AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  EventType
> = {
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectID;
  attributes?: Attributes;
  eventType: EventType;
};
