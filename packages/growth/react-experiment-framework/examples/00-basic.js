/* eslint-disable react/prop-types,react/no-multi-comp */
// @flow
import React, { Component } from 'react';

import asExperiment from '../src/asExperiment';
import ExperimentController from '../src/ExperimentController';

export class Control extends Component<{ title: string }> {
  render() {
    const { title } = this.props;
    const text = `Control ${title}`;
    return <div>{text}</div>;
  }
}

export class VariantA extends Component<{ title: string }> {
  render() {
    const { title } = this.props;
    const text = `Variant A ${title}`;
    return <div>{text}</div>;
  }
}

export class VariantB extends Component<{ title: string }> {
  render() {
    const { title } = this.props;
    const text = `Variant B ${title}`;
    return <div>{text}</div>;
  }
}

// eslint-disable-next-line react/require-render-return
export class Broken extends Component<{}> {
  render() {
    throw new Error('Threw on render');
  }
}

export class Loader extends Component<{}> {
  render() {
    return <div>Loading ...</div>;
  }
}

export const ExperimentWrapped = asExperiment(
  {
    variantA: VariantA,
    variantB: VariantB,
    broken: Broken,
    control: Control,
    fallback: Control,
  },
  'myExperimentKey',
  {
    onError: error => console.log('onError', error.message),
    onExposure: exposureDetails => console.log('onExposure', exposureDetails),
  },
  Loader,
);

const resolveAfterDelay = (resolvesTo, delay = 2000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(resolvesTo);
    }, delay);
  });

type Scenario = {
  name: string,
  resolvesTo: {
    cohort: string,
    isEligible: boolean,
    ineligibilityReasons?: string[],
  },
  hasError?: boolean,
};
const scenarios: Scenario[] = [
  {
    name: 'Control cohort and eligible',
    resolvesTo: {
      cohort: 'control',
      isEligible: true,
    },
  },
  {
    name: 'Variant A cohort and eligible',
    resolvesTo: {
      cohort: 'variantA',
      isEligible: true,
    },
  },
  {
    name: 'Variant B cohort and eligible',
    resolvesTo: {
      cohort: 'variantB',
      isEligible: true,
    },
  },
  {
    name: 'Reverts to control when ineligible',
    resolvesTo: {
      cohort: 'variantA',
      isEligible: false,
      ineligibilityReasons: ['because I say so'],
    },
  },
  {
    name: 'Reverts to control for non-defined cohort',
    resolvesTo: {
      cohort: 'nonExistentCohort',
      isEligible: true,
    },
    hasError: true,
  },
  {
    name: 'Reverts to control when variant component throws at render',
    resolvesTo: {
      cohort: 'broken',
      isEligible: true,
    },
    hasError: true,
  },
];

type State = {
  showErrorHandlingScenarios: boolean,
};

export default class extends Component<{}, State> {
  state = {
    showErrorHandlingScenarios: false,
  };

  handleErrorHandlingChange = (
    event: SyntheticInputEvent<HTMLInputElement>,
  ) => {
    this.setState({ showErrorHandlingScenarios: !!event.target.checked });
  };

  render() {
    const { showErrorHandlingScenarios } = this.state;
    const filteredScenarios = showErrorHandlingScenarios
      ? scenarios
      : scenarios.filter(s => !s.hasError);
    return (
      <table style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Sync render</th>
            <th>Async render (2s delay)</th>
          </tr>
        </thead>
        <tbody>
          {filteredScenarios.map(({ name, resolvesTo }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>
                <ExperimentController
                  experimentEnrollmentConfig={{
                    myExperimentKey: () => resolvesTo,
                  }}
                >
                  <ExperimentWrapped title="Component" />
                </ExperimentController>
              </td>
              <td>
                <ExperimentController
                  experimentEnrollmentConfig={{
                    myExperimentKey: () => resolveAfterDelay(resolvesTo, 2000),
                  }}
                >
                  <ExperimentWrapped title="Component" />
                </ExperimentController>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <label>
                <input
                  type="checkbox"
                  value={showErrorHandlingScenarios}
                  onChange={this.handleErrorHandlingChange}
                />
                Show error handling scenarios
              </label>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}
