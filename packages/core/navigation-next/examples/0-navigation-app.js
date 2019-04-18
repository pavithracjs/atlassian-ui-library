// @flow

import React, { Component } from 'react';

/*
 * Routing and Server Side Rendering
 * Make sure you correctly configure your
 * application's routes to be compatible
 * with SSR. For instructions on how to
 * SSR with React Router, check out their docs:
 * https://reacttraining.com/react-router/web/guides/server-rendering
 */

import { Route, Switch } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import { Label } from '@atlaskit/field-base';
import { ToggleStateless } from '@atlaskit/toggle';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

import {
  DefaultGlobalNavigation,
  LinkItem,
  ProjectSwitcher,
} from './shared/components';
import RootViews from './shared/views/root';
import ContainerViews from './shared/views/container';

import {
  BacklogView,
  ProjectsView,
  DashboardsView,
  SearchIssuesView,
} from './shared/routes';

export default class App extends Component<
  {},
  {
    isDebugEnabled: boolean,
    isFlyoutAvailable: boolean,
    isAlternateFlyoutBehaviourEnabled: boolean,
    isFullWitdhFlyoutEnabled: boolean,
  },
> {
  state = {
    isDebugEnabled: true,
    isFlyoutAvailable: true,
    isAlternateFlyoutBehaviourEnabled: true,
    isFullWitdhFlyoutEnabled: false,
  };

  onDebugToggle = () => {
    this.setState(state => ({ isDebugEnabled: !state.isDebugEnabled }));
  };

  onFlyoutToggle = () => {
    this.setState(state => ({ isFlyoutAvailable: !state.isFlyoutAvailable }));
  };

  onAlternateBehaviourToggle = () => {
    this.setState(state => ({
      isAlternateFlyoutBehaviourEnabled: !state.isAlternateFlyoutBehaviourEnabled,
    }));
  };

  onFullWidthFlyoutToggle = () => {
    this.setState(state => ({
      isFullWitdhFlyoutEnabled: !state.isFullWitdhFlyoutEnabled,
    }));
  };

  render() {
    const {
      isDebugEnabled,
      isFlyoutAvailable,
      isAlternateFlyoutBehaviourEnabled,
      isFullWitdhFlyoutEnabled,
    } = this.state;

    return (
      <MemoryRouter>
        <NavigationProvider isDebugEnabled={isDebugEnabled}>
          <LayoutManagerWithViewController
            customComponents={{ LinkItem, ProjectSwitcher }}
            experimental_flyoutOnHover={isFlyoutAvailable}
            experimental_alternateFlyoutBehaviour={
              isAlternateFlyoutBehaviourEnabled
            }
            experimental_fullWidthFlyout={isFullWitdhFlyoutEnabled}
            globalNavigation={DefaultGlobalNavigation}
          >
            <div style={{ padding: 40 }}>
              <RootViews />
              <ContainerViews />
              <Switch>
                <Route path="/projects/:projectId" component={BacklogView} />
                <Route path="/projects" component={ProjectsView} />
                <Route path="/issues/search" component={SearchIssuesView} />
                <Route path="/" component={DashboardsView} />
              </Switch>

              <p>
                The search drawer can be opened via the <kbd>/</kbd> keyboard
                shortcut.
              </p>
              <Label label="Toggle flyout on hover (experimental)" />
              <ToggleStateless
                isChecked={isFlyoutAvailable}
                onChange={this.onFlyoutToggle}
              />
              <Label label="Toggle alternate hover behaviour (experimental)" />
              <ToggleStateless
                isChecked={isAlternateFlyoutBehaviourEnabled}
                onChange={this.onAlternateBehaviourToggle}
              />
              <Label label="Toggle full width flyout (experimental)" />
              <ToggleStateless
                isChecked={isFullWitdhFlyoutEnabled}
                onChange={this.onFullWidthFlyoutToggle}
              />
              <Label label="Toggle debug logger" />
              <ToggleStateless
                isChecked={isDebugEnabled}
                onChange={this.onDebugToggle}
              />
            </div>
          </LayoutManagerWithViewController>
        </NavigationProvider>
      </MemoryRouter>
    );
  }
}
