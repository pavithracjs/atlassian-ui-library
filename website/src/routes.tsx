import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { ModalTransition } from '@atlaskit/modal-dialog';

import Home from './pages/Home';
import Package from './pages/Package';
import Pattern from './pages/Pattern';
import Document from './pages/Document';
import FourOhFour from './pages/FourOhFour';
import PackagesList from './pages/PackagesList';
import PatternsInfo from './pages/PatternsInfo';
import PackageDocument from './pages/PackageDocument';
import ChangeLogExplorer from './pages/ChangeLogExplorer';
import ChangelogModal, {
  Props as ChangelogModalProps,
} from './pages/Package/ChangelogModal';
import ExamplesModal, {
  Props as ExamplesModalProps,
} from './pages/Package/ExamplesModal';

const home = [
  {
    exact: true,
    path: '/',
    component: Home,
  },
];

const staticDocs = [
  {
    path: '/docs/:docId*',
    component: Document,
  },
];

/**
 * We do not support patterns on the current website
 * This exist as part of the migration from old build
 * Keeping it here for reference
 */
// @ts-ignore pattern is here for reference, it is not used on website anywhere
const patterns = [
  { path: '/patterns/:patternId*', component: Pattern },
  {
    path: '/patterns',
    component: PatternsInfo,
    exact: true,
  },
];

const packagesDocs = [
  { path: '/packages/:groupId/:pkgId/docs/:docId', component: PackageDocument },
  { path: '/packages/:groupId/:pkgId', component: Package },
  {
    path: '/packages',
    component: PackagesList,
  },
];

const examples = [
  {
    path: '/packages/examples',
    component: ({ location }: RouteComponentProps) => (
      <Redirect to={location.pathname.replace('/examples', '')} />
    ),
  },
];

const changelogs = [
  { path: '/changelog/:groupId/:pkgId/:semver?', component: ChangeLogExplorer },
];

const fourOhFour = [
  {
    path: '/error',
    component: FourOhFour,
  },
];

const redirects = [
  {
    path: '/mk-2',
    render: (props: RouteComponentProps) => (
      <Redirect to={props.location.pathname.replace('/mk-2', '')} />
    ),
  },
  {
    path: '/components',
    render: (props: RouteComponentProps) => (
      <Redirect
        to={props.location.pathname.replace('/components', '/packages/core')}
      />
    ),
  },
];

export const pageRoutes = [
  ...redirects,
  ...home,
  ...staticDocs,
  ...packagesDocs,
  ...examples,
  ...changelogs,
  ...fourOhFour,
  // fallback url in case there are no matches
  {
    component: FourOhFour,
  },
];

const changelogModal = [
  {
    path: '/packages/:groupId/:pkgId/changelog/:semver?',
    children: (props: RouteComponentProps) => (
      <ModalTransition>
        {props.match && <ChangelogModal {...props as ChangelogModalProps} />}
      </ModalTransition>
    ),
  },
];

const examplesModal = [
  {
    path: '/packages/:groupId/:pkgId/example/:exampleId',
    children: (props: RouteComponentProps) => (
      <ModalTransition>
        {props.match && <ExamplesModal {...props as ExamplesModalProps} />}
      </ModalTransition>
    ),
  },
];

export const modalRoutes = [...changelogModal, ...examplesModal];
