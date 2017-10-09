// @flow

import ArrowleftIcon from '@atlaskit/icon/glyph/arrowleft';
import ArrowrightIcon from '@atlaskit/icon/glyph/arrowright';
import { colors } from '@atlaskit/theme';
import React, { Component } from 'react';
import { getMonthName } from '../util';
import Btn from './Btn';

import { Heading, MonthAndYear } from '../styled/Heading';

type Props = {|
  month: number,
  year: number,
  handleClickNext: () => void,
  handleClickPrev: () => void,
|};

export default class CalendarHeading extends Component<Props> {
  props: Props;

  render() {
    const { month, year } = this.props;
    return (
      <Heading>
        <div aria-hidden="true" onClick={this.props.handleClickPrev}>
          <Btn>
            <ArrowleftIcon label="Last month" size="medium" primaryColor={colors.N80} />
          </Btn>
        </div>
        <MonthAndYear>{`${getMonthName(month)} ${year}`}</MonthAndYear>
        <div aria-hidden="true" onClick={this.props.handleClickNext}>
          <Btn>
            <ArrowrightIcon label="Next month" size="medium" primaryColor={colors.N80} />
          </Btn>
        </div>
      </Heading>
    );
  }
}
