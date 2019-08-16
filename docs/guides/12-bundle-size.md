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

In Atlaskit, we use a tool *measure* that uses Webpack-bundle-analyzer. In the past, we used local ratchet files to store the relevant output of the measure and we used them to compare between versions.
As this solution was not ideal, we moved the logic and the ratchet files to s3.

More about the journey:
- [Atlaskit+now+has+a+bundle+size+ratchet](https://hello.atlassian.net/wiki/spaces/AtlasKit/blog/2019/01/11/378834980/Atlaskit+now+has+a+bundle+size+ratchet).
- [Bundle size add on](https://hello.atlassian.net/wiki/spaces/AtlasKit/blog/2019/05/16/458923875/Atlaskit+-+Bundle+size+check+add-on) about it.
.)
- [Release add-on to Atlaskit](https://hello.atlassian.net/wiki/spaces/TBTT/blog/2019/08/13/531210841/Atlaskit+PR+s+update....Bundle+size+checking...).

## Usage

### Locally

If you are unsure about what to do locally , please run: yarn measure --help
 ```
  Usage
        $ measure <[paths]|[pkgs]>

      Options
        --analyze               Opens bundle analyzer report
        --json                  Outputs measure stats as json
        --lint                  Lint mode fails build if size has been increased beyond threshold
        --updateSnapshot        Update measure snapshots
        --s3                    Run S3 flow

      Examples
        $ measure editor-core editor-common
        $ measure editor-core --updateSnapshot
        $ measure editor-core --analyze
```

### CI

In CI, the flow is using s3. Ratchet files are generated and stored by commit. Every hour, a custom build computes the master bundle size for all the packages and then stored it on s3. An add-on on pull-request will display a comparison between your s3 committed files to s3 master.
Reviewers will need to approve those changes.

For further details, please read this [blog](https://hello.atlassian.net/wiki/spaces/TBTT/blog/2019/08/13/531210841/Atlaskit+PR+s+update....Bundle+size+checking...) or jump on [#bundle-size-addon](https://app.slack.com/client/TFCUTJ0G5/CJETTKT63/thread/CFGLY49D2-1565841834.207200) Slack channel.


# What is the most important information in a bundle size measurement?

As a developer, the output of the measure tool / file gives you a list of different measurements grouped in the following categories:

* Source code – the size of the source code of a measured package, which is split into main and async chunks. 

* Main – includes all synchronously loaded code inside a give packages.

* Async – includes all asynchronously loaded code inside a package e.g. import('./something').then(...).

* External dependencies –  basically, the size of everything that was imported from node_modules folder. Also split an async and main chunks.

* Atlaskit dependencies – since we are Atlaskit, we treat Atlaskit dependencies differently. In addition, we want to have more detailed breakdown of how the dependencies contribute to the bundle size of other atlaskit packages. In this category you can see what atlaskit packages groups contributed to your package bundle size. Also split in main and async bundle following the same principles as previous categories.

* Combined size – since gzip can show different results depending on how many content the resulting bundle has, it makes sense to combine all chunks together and see how well they are compressed. Also split in main and async sub-chunks.

Local output example:
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
S3 / CI output [example](https://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts/c1a9ff173fc5/merged.json):

```
[
  {
    team: "core",
    package: "@atlaskit/badge",
    version: "12.0.4",
    dependent: false,
    id: "src.main",
    name: "main",
    stats: {
      size: 4228,
      gzipSize: 1701,
      originalSize: 4200,
      newSize: 4228,
      sizeDiff: 28,
      gzipOriginalSize: 1685,
      gzipSizeDiff: 16
    }
  },
  {
    team: "core",
    package: "@atlaskit/badge",
    version: "12.0.4",
    dependent: false,
    id: "node_modules.main",
    name: "node_modules [main]",
    stats: {
      size: 72689,
      gzipSize: 25647,
      originalSize: 3425,
      newSize: 72689,
      sizeDiff: 69264,
      gzipOriginalSize: 1232,
      gzipSizeDiff: 24415
    }
  },
  {
    team: "core",
    package: "@atlaskit/badge",
    version: "12.0.4",
    dependent: false,
    id: "atlaskit.core.main",
    name: "main",
    stats: {
      size: 12254,
      gzipSize: 3329,
      originalSize: 12252,
      newSize: 12254,
      sizeDiff: 2,
      gzipOriginalSize: 3329,
      gzipSizeDiff: 0
    }
  },
  {
    team: "core",
    package: "@atlaskit/badge",
    version: "12.0.4",
    dependent: false,
    id: "combined.main",
    name: "main",
    stats: {
    size: 87763,
    gzipSize: 29716,
    originalSize: 18467,
    newSize: 87763,
    sizeDiff: 69296,
    gzipOriginalSize: 5433,
    gzipSizeDiff: 24283
    }
  }
]
```