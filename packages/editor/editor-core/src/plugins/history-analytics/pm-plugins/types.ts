import { StepMap, Step } from 'prosemirror-transform';

export interface PmHistoryItem {
  map: StepMap;
  mirrorOffset?: number;
  selection?: Selection;
  step: Step;
}

export interface PmHistoryLeaf {
  values: PmHistoryItem[];
  length: number;
  forEach: (
    handler: (item: PmHistoryItem) => boolean | void,
    from?: number,
    to?: number,
  ) => void;
}

export interface PmHistoryBranch {
  items: PmHistoryLeaf;
  eventCount: number;
}

export interface PmHistoryPluginState {
  done: PmHistoryBranch;
  undone: PmHistoryBranch;
  prevMap: StepMap;
  prevTime: number;
}
