import React from 'react';
import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

export interface RowCellType {
  key?: string | number;
  colSpan?: number;
  content?: React.ReactNode | string;
}

export interface I18nShape {
  prev: string;
  next: string;
}

export interface StatelessProps extends WithAnalyticsEventsProps {
  caption?: React.ReactNode;
  /** Object describing the column headings */
  head?: HeadType;
  /** The data to render in the table */
  rows?: Array<RowType>;
  /** Component to render when there is no data */
  emptyView?: React.ReactElement<any>;
  /** Controls the size of the rendered spinner */
  loadingSpinnerSize?: LoadingSpinnerSizeType;
  /** Whether to show the loading state or not */
  isLoading?: boolean;
  isFixedSize?: boolean;
  /** The maximum number of rows per page. No maximum by default. */
  rowsPerPage?: number;
  /** Called when the page changes. Provides an analytics event when the page change was from a click on pagination component. */
  onSetPage?: (page: number, UIAnalyticsEvent?: UIAnalyticsEvent) => void;
  /** Called when a column is sorted. Provides information about what was sorted and an analytics event. */
  onSort?: (data: any, UIAnalyticsEvent?: UIAnalyticsEvent) => void;
  /** Called after body table render when visible table rows change with table rows given. */
  onPageRowsUpdate?: (pageRows: Array<RowType>) => void;
  /** The current page number */
  page?: number;
  defaultPage?: number;
  /** The property to sort items by */
  sortKey?: string;
  /** Whether to sort in ascending or descending order */
  sortOrder?: SortOrderType;
  /** Whether to allow 'rank' sort in addition to ascending/descending */
  isRankable?: boolean;
  isRankingDisabled?: boolean;
  onRankStart?: (rankStart: RankStart) => void;
  onRankEnd?: (rankEnd: RankEnd, uiAnalyticsEvent?: UIAnalyticsEvent) => void;
  paginationi18n?: I18nShape;
}

export interface StatefulProps extends WithAnalyticsEventsProps {
  caption?: Node | string;
  head?: HeadType;
  rows?: Array<RowType>;
  emptyView?: React.ReactElement<any>;
  loadingSpinnerSize?: LoadingSpinnerSizeType;
  isLoading?: boolean;
  isFixedSize?: boolean;
  rowsPerPage?: number;
  onSetPage?: (page: number, UIAnalyticsEvent?: UIAnalyticsEvent) => void;
  onSort?: (data: any, UIAnalyticsEvent?: UIAnalyticsEvent) => void;
  onPageRowsUpdate?: (pageRows: Array<RowType>) => void;
  page?: number;
  defaultPage?: number;
  sortKey?: string;
  defaultSortKey?: string;
  sortOrder?: SortOrderType;
  defaultSortOrder?: SortOrderType;
  isRankable?: boolean;
  isRankingDisabled?: boolean;
  onRankStart?: (rankStart: RankStart) => void;
  onRankEnd?: (rankEnd: RankEnd) => void;
  paginationi18n?: I18nShape;
}

export type RowType = {
  cells: Array<RowCellType>;
  key?: string;
};

export type SortOrderType = 'ASC' | 'DESC';

export type SpinnerSizeType =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';

export type LoadingSpinnerSizeType = 'small' | 'large';

export interface HeadCellType extends RowCellType {
  isSortable?: boolean;
  width?: number;
  shouldTruncate?: boolean;
}

export interface RankEndLocation {
  index: number; // index on current page
  afterKey?: string;
  beforeKey?: string;
}

export interface RankEnd {
  sourceIndex: number;
  sourceKey: string;
  destination?: RankEndLocation;
}

export interface RankStart {
  index: number;
  key: string;
}

export interface HeadType {
  cells: Array<HeadCellType>;
}
