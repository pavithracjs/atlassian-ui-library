import React from 'react';
import Media from 'react-media';
import GlobalTheme from '@atlaskit/theme';
import Page from '@atlaskit/page';
import { RouteProps } from 'react-router';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { DESKTOP_BREAKPOINT_MIN } from '../constants';
import FullscreenExamples from '../pages/Examples';
import { modalRoutes, pageRoutes } from '../routes';
import ScrollHandler from '../components/ScrollToTop';
import ErrorBoundary from '../components/ErrorBoundary';
import AnalyticsListeners from '../components/Analytics/AnalyticsListeners';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default () => {
  return (
    <GlobalTheme.Provider value={() => ({ mode: 'light' })}>
      <BrowserRouter>
        <Media query={`(min-width: ${DESKTOP_BREAKPOINT_MIN}px)`}>
          {(isDesktop: boolean) => (
            <AnalyticsListeners>
              <ScrollHandler />
              <Switch>
                <Route
                  path="/examples/:groupId?/:pkgId?/:exampleId*"
                  component={FullscreenExamples}
                />
                <Route
                  render={appRouteDetails => (
                    <Page
                      navigation={
                        isDesktop ? <DesktopNav {...appRouteDetails} /> : false
                      }
                    >
                      {!isDesktop && (
                        <MobileNav appRouteDetails={appRouteDetails} />
                      )}
                      <ErrorBoundary>
                        <Switch>
                          {pageRoutes.map((routeProps: RouteProps, index) => (
                            <Route {...routeProps} key={index} />
                          ))}
                        </Switch>

                        {modalRoutes.map((modal, index) => (
                          <Route {...modal} key={index} />
                        ))}
                      </ErrorBoundary>
                    </Page>
                  )}
                />
              </Switch>
            </AnalyticsListeners>
          )}
        </Media>
      </BrowserRouter>
    </GlobalTheme.Provider>
  );
};
