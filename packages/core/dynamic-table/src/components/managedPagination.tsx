import * as React from 'react';
import Pagination from '@atlaskit/pagination';

export interface Props {
  value?: number;
  onChange: (newValue: any, analyticsEvent: any) => void;
  total: number;
  i18n?: {
    next: string;
    prev: string;
  };
}

export default class ManagedPagination extends React.Component<Props> {
  onChange = (
    // @ts-ignore - never use
    event: React.SyntheticEvent<any>,
    newValue: any,
    // AnalyticsEvent
    analyticsEvent?: any,
  ) => {
    this.props.onChange(newValue, analyticsEvent);
  };

  render() {
    const { total, value = 1, i18n } = this.props;
    const pages = [...Array(total)].map((_, index) => index + 1);
    // Pagination accepts array now thus selectedIndex starts with 0
    // So, we are substracting value by one thus not breaking dynamic table
    const selectedIndex = value - 1;
    return (
      <Pagination
        selectedIndex={selectedIndex}
        i18n={i18n}
        onChange={this.onChange}
        pages={pages}
      />
    );
  }
}
