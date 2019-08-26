import React, { Children, Component, useContext, FC } from 'react';
import PropTypes from 'prop-types';
import {
  AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from './AnalyticsReactContext';

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

type InternalProps = { newContext: AnalyticsReactContextInterface };

class AnalyticsContextInternal extends Component<Props & InternalProps> {
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
    const {
      newContext: { getAtlaskitAnalyticsEventHandlers },
      children,
    } = this.props;
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

const AnalyticsContext: FC<Props> = props => {
  const newContext = useContext(AnalyticsReactContext);
  return <AnalyticsContextInternal {...props} newContext={newContext} />;
};

export default AnalyticsContext;
