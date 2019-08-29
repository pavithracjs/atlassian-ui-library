import React, { Fragment } from 'react';
import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

export const bitbucketPrimaryItems = [
  {
    id: 'work',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Your work click', ...args);
    },
    text: 'Your work',
  },
  {
    id: 'workspaces',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Workspaces click', ...args);
    },
    text: 'Workspaces',
  },
  {
    id: 'repositories',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Repositories click', ...args);
    },
    text: 'Repositories',
  },
  {
    id: 'projects',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Projects click', ...args);
    },
    text: 'Projects',
  },
  {
    id: 'pullrequests',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Pull requests click', ...args);
    },
    text: 'Pull requests',
  },
  {
    id: 'issues',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Issues click', ...args);
    },
    text: 'Issues',
  },
];

const ConfluenceAppsContent = () => (
  <Fragment>
    <DropdownItem>Calendars</DropdownItem>
    <DropdownItem>Analytics</DropdownItem>
    <DropdownItem>Questions</DropdownItem>
    <DropdownItem>Tree Search</DropdownItem>
  </Fragment>
);

const SpacesContent = () => (
  <Fragment>
    <DropdownItemGroup title="Starred spaces">
      <DropdownItem>My space</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup>
      <DropdownItem>View all spaces</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

export const confluencePrimaryItems = [
  {
    id: 'activity',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Activity click', ...args);
    },
    text: 'Activity',
  },
  {
    id: 'work',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Your work click', ...args);
    },
    text: 'Your work',
  },
  {
    dropdownContent: SpacesContent,
    id: 'spaces',
    onClick: (...args: any[]) => {
      console.log('Spaces click', ...args);
    },
    text: 'Spaces',
  },
  {
    id: 'people',
    onClick: (...args: any[]) => {
      console.log('People click', ...args);
    },
    text: 'People',
  },
  {
    dropdownContent: ConfluenceAppsContent,
    id: 'apps',
    onClick: (...args: any[]) => {
      console.log('Apps click', ...args);
    },
    text: 'Apps',
  },
];

const ProjectsContent = () => (
  <Fragment>
    <DropdownItemGroup title="Favourite Projects">
      <DropdownItem>Mobile Research</DropdownItem>
      <DropdownItem>IT Services</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Recent Projects">
      <DropdownItem>Engineering Leadership</DropdownItem>
      <DropdownItem>BAU</DropdownItem>
      <DropdownItem>Hardware Support</DropdownItem>
      <DropdownItem>New Features</DropdownItem>
      <DropdownItem>SAS</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

const IssuesContent = () => (
  <Fragment>
    <DropdownItemGroup title="Recent Issues">
      <DropdownItem>Issue One</DropdownItem>
      <DropdownItem>Issue Two</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup>
      <DropdownItem>View all recent issues</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Filters">
      <DropdownItem>Filter One</DropdownItem>
      <DropdownItem>Filter Two</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

const DashboardsContent = () => (
  <Fragment>
    <DropdownItemGroup>
      <DropdownItem>System Dashboard</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup>
      <DropdownItem>View all dashboards</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

export const jiraPrimaryItems = [
  {
    id: 'home',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Home click...', ...args);
    },
    text: 'Home',
  },
  {
    dropdownContent: ProjectsContent,
    id: 'projects',
    onClick: (...args: any[]) => {
      console.log('Projects click', ...args);
    },
    text: 'Projects',
  },
  {
    dropdownContent: IssuesContent,
    id: 'issues',
    onClick: (...args: any[]) => {
      console.log('Issues click', ...args);
    },
    text: 'Issues & Filters',
  },
  {
    dropdownContent: DashboardsContent,
    id: 'dashboards',
    onClick: (...args: any[]) => {
      console.log('Dashboards click', ...args);
    },
    text: 'Dashboards',
  },
];

export const opsGeniePrimaryItems = [
  {
    id: 'alerts',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Alerts click', ...args);
    },
    text: 'Alerts',
  },
  {
    id: 'incidents',
    href: '#',
    onClick: (...args: any[]) => {
      console.log('Incidents click', ...args);
    },
    text: 'Incidents',
  },
  {
    id: 'oncall',
    onClick: (...args: any[]) => {
      console.log('Who is on-call click', ...args);
    },
    text: 'Who is on-call',
  },
  {
    id: 'teams',
    onClick: (...args: any[]) => {
      console.log('Teams click', ...args);
    },
    text: 'Teams',
  },
  {
    id: 'services',
    onClick: (...args: any[]) => {
      console.log('Services click', ...args);
    },
    text: 'Services',
  },
  {
    id: 'analytics',
    onClick: (...args: any[]) => {
      console.log('Analytics click', ...args);
    },
    text: 'Analytics',
  },
];

export const defaultPrimaryItems = jiraPrimaryItems;
