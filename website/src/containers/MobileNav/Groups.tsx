import * as React from 'react';
import PropTypes from 'prop-types';
import { Route, matchPath } from 'react-router-dom';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import packagesNav from './navigations/Packages';
import docsNav from './navigations/Docs';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import OverviewIcon from '@atlaskit/icon/glyph/overview';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Button from '@atlaskit/button';
import {
  AkContainerNavigationNested as NestedNav,
  AkNavigationItem,
} from '@atlaskit/navigation';

import { Directory } from '../../types';

export type GroupsProps = {
  docs: Directory;
  patterns: Directory;
  packages: Directory;
  onClick?: (e: Event) => void | undefined;
};

export type GroupsState = {
  parentRoute?: Object | null;
  stack: Array<React.ReactNode>;
};

export type GroupsContext = {
  router: { route: Route };
};

export default class Groups extends React.Component<
  GroupsProps & { onClick: () => void },
  GroupsState
> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state: GroupsState = {
    parentRoute: null,
    stack: [
      [
        <AkNavigationItem
          text="Documentation"
          icon={<OverviewIcon label="Documentation" />}
          action={
            <Button
              appearance="subtle"
              iconBefore={
                <ChevronRightIcon label="documentation" size="medium" />
              }
              spacing="none"
            />
          }
          onClick={() => this.createDocumentationStack()}
          key={'Documentation'}
        />,
        <AkNavigationItem
          text="Packages"
          icon={<ComponentIcon label="Packages icon" />}
          action={
            <Button
              appearance="subtle"
              iconBefore={<ChevronRightIcon label="packages" size="medium" />}
              spacing="none"
            />
          }
          onClick={() => this.createPackagesStack()}
          key={'Packages'}
        />,
      ],
    ],
  };

  UNSAFE_componentWillMount() {
    //buildNavForPath(this.context.router.route.location.pathname);
    this.resolveRoutes(this.context.router.route.location.pathname);
  }

  UNSAFE_componentWillReceiveProps(
    nextProps: GroupsProps,
    nextContext: GroupsContext,
  ) {
    this.resolveRoutes((nextContext.router.route as any).location.pathname);
  }

  popStack = () => {
    this.setState({
      stack: [...this.state.stack.slice(0, -1)],
    });
  };

  createDocumentationStack = () => {
    this.setState({
      stack: [
        ...this.state.stack,
        [
          <AkNavigationItem
            text="Back"
            icon={<ArrowLeftIcon label="Back" />}
            onClick={() => this.popStack()}
            key="back"
          />,
          ...docsNav({
            pathname: this.context.router.route.location.pathname,
            docs: this.props.docs,
            onClick: () => this.props.onClick(),
          }),
        ],
      ],
    });
  };

  createPackagesStack = () => {
    this.setState({
      stack: [
        ...this.state.stack,
        [
          <AkNavigationItem
            text="Back"
            icon={<ArrowLeftIcon label="Add-ons icon" />}
            onClick={() => this.popStack()}
            key="back"
          />,
          ...packagesNav({
            pathname: this.context.router.route.location.pathname,
            packages: this.props.packages,
            onClick: () => this.props.onClick(),
          }),
        ],
      ],
    });
  };

  resolveRoutes = (pathname: string) => {
    if (matchPath(pathname, '/docs')) {
      this.createDocumentationStack();
    } else if (matchPath(pathname, '/packages')) {
      this.createPackagesStack();
    }
  };

  addItemsToStack = (items: Array<React.ReactNode>) => {
    this.setState({
      stack: [...this.state.stack, [...items]],
    });
  };

  render() {
    const { stack } = this.state;
    return <NestedNav stack={stack} />;
  }
}
