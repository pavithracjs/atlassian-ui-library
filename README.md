# Atlaskit

[![node v8.4.0+](https://img.shields.io/badge/node-v8.4.0%2B-brightgreen.svg)](https://nodejs.org/en/)
[![bolt v0.20.6+](https://img.shields.io/badge/bolt-v0.20.6%2B-brightgreen.svg)](http://boltpkg.com/)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://ecosystem.atlassian.net/servicedesk/customer/portal/24)

Atlaskit is the technical implementation of the [Atlassian Design Guidelines][adg]. It is a collection of reusable components that can be downloaded independently into your projects. Each component is also independently versioned and published to npm.

The full list of components can be found in the [Atlaskit Registry][atlaskitregistry].

**This project is bound by a [Code of Conduct][codeofconduct].**

# Installation and usage

Atlaskit components and utilities are available as discrete npm packages.

The `@atlassiansox/analytics-web-client` package is a peer dependency as it is a private package and so must be installed alongside the tool.

#### Pre-requisites

It's strongly advised to use the Atlaskit CSS reset in your whole project, or some Atlaskit components
may diverge in appearance:

```javascript
import '@atlaskit/css-reset';
```

In general, you should avoid directly styling base elements (ex. p, h1, h2) and uses classes instead.

#### Example for React projects

Atlaskit components are built for React. Here's an example of using the Avatar component:

1. First, you specify a component into your project as a dependency using npm: `npm install @atlaskit/avatar`
2. Then you can use it in your React projects like this:

```javascript
import React from 'react';
import Avatar from '@atlaskit/avatar';

export default (
  <Avatar
    src="https://design.atlassian.com/images/avatars/project-128.png"
    presence="online"
    size="large"
  />
);
```

Check out the [Atlaskit Registry][atlaskitregistry] to learn more.

#### Example for non-React projects

There is a subset of components available as styles called the Reduced UI pack.
To use:

1. You include these into your the HTML projects.

```html
<link rel="stylesheet" href="//unpkg.com/@atlaskit/css-reset@latest" />
<link rel="stylesheet" href="//unpkg.com/@atlaskit/reduced-ui-pack@latest" />
```

2. Then you can style HTML with

`<button class="ak-button ak-button__appearance-primary">Submit</button>`

Check out the [Reduced UI pack](http://go.atlassian.com/reduced-ui-pack) for more examples and details.

#### Upgrading components

When upgrading an Atlaskit component, all changelogs can be found in the [Atlaskit Registry][atlaskitregistry].

# Documentation

A comprehensive list of components and detailed usage of each can be found in the [Atlaskit Registry][atlaskitregistry], which contains both guides on contributing to atlaskit, as well as documentation for each package.

You can also find how each component is meant to be used from a design perspective on the [Atlassian Design Guidelines][adg] website.

# Contributing

We believe in open contributions and the power of a strong development community. Pull requests, bug reports, and comments are welcomed!

[Read the contribution guide on our website][contributing_site] to get started, and our [CONTRIBUTING.md][contributing_repo] for more details.

Here are some quick tips for various contributions:

### Reporting issues

Our [CONTRIBUTING.md][contributing_repo] includes links for where to raise issues to Atlaskit.

### Contributing code

Atlassian requires contributors to sign a Contributor License Agreement,
known as a CLA. This serves as a record stating that the contributor is
entitled to contribute the code/documentation/translation to the project
and is willing to have it used in distributions and derivative works
(or is willing to transfer ownership).

Please read our [CONTRIBUTING.md][contributing_repo] for details on how to become a contributor
and for our guidelines around contributions.

Some quick tips for making successful contributions to Atlaskit:

- Do not raise pull requests from forks because our CI builds do not run on forks. Create a pull request from a branch instead.
- Add tests for new features and bug fixes.
- Follow the existing style.
- Separate unrelated changes into multiple pull requests.

# License

This is a [mono-repo][monorepo], which means that different parts of this repository can have different licenses.

The base level of the repository is licensed under [Apache 2.0][license]. There are separate license files (`LICENSE`) for each component under `/packages` that specify the license restrictions for each component. While most components are licensed under the Apache 2.0 license, please note packages containing styles, assets & icons are most likely licensed under the [Atlassian Design Guidelines license][adg_license].

If you fork this repository you can continue to use those Atlassian Design Guidelines licensed components only under the given license restrictions. If you want to redistribute this repository, you will need to replace these Atlassian Design Guidelines licensed components with your own implementation.

Copyright (c) 2018 Atlassian and others.

[adg]: http://atlassian.design/ 'Atlassian Design Guidelines'
[adg_license]: https://atlassian.design/guidelines/handy/license
[contributing_repo]: ./CONTRIBUTING.md
[contributing_site]: https://atlaskit.atlassian.com/docs/guides/contributing
[license]: ./LICENSE
[atlaskitregistry]: https://atlaskit.atlassian.com/ 'Atlaskit Registry'
[codeofconduct]: ./CODE_OF_CONDUCT.md
[monorepo]: https://github.com/babel/babel/blob/master/doc/design/monorepo.md
