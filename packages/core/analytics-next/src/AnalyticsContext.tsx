import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { AnalyticsReactContext } from './AnalyticsReactContext';

const ContextTypes = {
  getAtlaskitAnalyticsContext: PropTypes.func,
};

interface Props {
  /** Children! */
  children: React.ReactNode;
  /** Arbitrary data. Any events created below this component in the tree will
   * have this added as an item in their context array. */
  data: unknown;
}

class AnalyticsContext extends Component<Props> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  getChildContext = () => ({
    getAtlaskitAnalyticsContext: this.getAnalyticsContext,
  });

  getAnalyticsContext = () => {
    const { data } = this.props;
    const { getAtlaskitAnalyticsContext } = this.context;
    const ancestorData =
      (typeof getAtlaskitAnalyticsContext === 'function' &&
        getAtlaskitAnalyticsContext()) ||
      [];

    return [...ancestorData, data];
  };

  render() {
    const { getAtlaskitAnalyticsEventHandlers = () => [] } = this.context;
    const { children } = this.props;
    return (
      <AnalyticsReactContext.Provider
        value={{
          getAtlaskitAnalyticsContext: this.getAnalyticsContext,
          getAtlaskitAnalyticsEventHandlers,
        }}
      >
        {Children.only(children)}
      </AnalyticsReactContext.Provider>
    );
  }
}

export default AnalyticsContext;
