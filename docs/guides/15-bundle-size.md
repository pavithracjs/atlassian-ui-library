---
title: Bundle size documentation
description: A guide to document 'all the thing' about the bundle size in Atlaskit.
---

# What is the bundle size?

It is basically analyzing JavaScript collections of files using the source maps. This helps you understand where code bloat is coming from.

# Why does it matter?

When you talk about Apdex, load times or any performance app related, the bundle size is critical.

Analyzing it enables to optimize your dependencies and improve your app.

# How to measure the bundle size?

There are couple of tools that measure the bundle size:

* [Bundlephobia](https://bundlephobia.com)

* [Webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

# How do we currently measure the bundle size in Atlaskit?

In Atlaskit, we use a tool *measure* that uses Webpack-bundle-analyzer. We use ratchet files to store the relevant output of the measure and we use them to compare between versions.

More about it how does it work, is available in this [blog](https://hello.atlassian.net/wiki/spaces/AtlasKit/blog/2019/01/11/378834980/Atlaskit+now+has+a+bundle+size+ratchet).

## Usage

If you are unsure about what to do locally , please run: bolt measure --help
 ```
  Usage
        $ measure <[paths]|[pkgs]>

      Options
        --analyze               Opens bundle analyzer report
        --json                  Outputs measure stats as json
        --lint                  Lint mode fails build if size has been increased beyond threshold
        --updateSnapshot        Update measure snapshots

      Examples
        $ measure editor-core editor-common
        $ measure editor-core --updateSnapshot
        $ measure editor-core --analyze
```

# What is the most important information in a bundle size measurement?

As a developer, the output of the measure tool / file gives you a list of different measurements grouped in the following categories:

* Source code – the size of the source code of a measured package, which is split into main and async chunks. 

* Main – includes all synchronously loaded code inside a give packages.

* Async – includes all asynchronously loaded code inside a package e.g. import('./something').then(...).

* External dependencies –  basically, the size of everything that was imported from node_modules folder. Also split an async and main chunks.

* Atlaskit dependencies – since we are Atlaskit, we treat Atlaskit dependencies differently. In addition, we want to have more detailed breakdown of how the dependencies contribute to the bundle size of other atlaskit packages. In this category you can see what atlaskit packages groups contributed to your package bundle size. Also split in main and async bundle following the same principles as previous categories.

* Combined size – since gzip can show different results depending on how many content the resulting bundle has, it makes sense to combine all chunks together and see how well they are compressed. Also split in main and async sub-chunks.

Output example:
```
# Editor-core
  Source code:
    – main: 928 kB (425 kB)  +365 kB (+278 kB)
    – async: 24.3 kB (6.34 kB)  0 B (-6 B)

  External dependencies:
    – node_modules [main]: 702 kB (204 kB)  +34 B (-23 B)
    – node_modules [async]: 241 kB (67.5 kB)  -12.5 kB (-4.3 kB)

  Atlaskit dependencies:
    core:
      – main: 432 kB (92.7 kB)  +24 B (+31 B)
      – async: 182 kB (38.4 kB)  +1.91 kB (-157 B)
    editor:
      – main: 117 kB (28.8 kB)  -3 B (+131 B)
    elements:
      – main: 142 kB (41 kB)  -8 B (0 B)
      – async: 36.4 kB (10 kB)  +2 B (-6 B)
    media:
      – main: 229 kB (53.2 kB)  -505 B (+547 B)
      – async: 757 kB (188 kB)  -201 B (-27 B)
    teamwork-ecosystem:
      – async: 625 B (368 B)

  Combined:
    – main: 2.54 MB (857 B)
```

# What changes to expect about the bundle size in Atlaskit in the future?

As the current solution is not ideal, we are working on a bitbucket add-on to display it on PR.

Feel free to read the [blog](https://hello.atlassian.net/wiki/spaces/AtlasKit/blog/2019/05/16/458923875/Atlaskit+-+Bundle+size+check+add-on) about it.

