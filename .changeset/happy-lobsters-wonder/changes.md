Branch installer now works on a commit level instead of branch level, lots of API changes

**From the help message**

```
Installs the Atlaskit dependency versions from the given commit.

  Usage
      $ atlaskit-branch-installer commitHash
    Options
      --engine Which engine to use (bolt/yarn) [Default: yarn]
      --cmd Command to run to install packages (add/upgrade) [Default: add]
      --dry-run Do not install the packages just print it
      --verbose Show what is going on

      [Advanced]
      --packages Comma separated list of packages to install from commit [Default: all]
      --timeout Maximum time to wait (in ms) for a manifest to be published for a commit [Default: 20000]
      --interval How long to wait (in ms) between retries when looking for packages manifest [Default: 5000]

    Examples
      $ yarn atlaskit-branch-installer 6ce63f22816e --verbose
      $ yarn atlaskit-branch-installer 6ce63f22816e --packages=@atlaskit/avatar,@atlaskit/editor-core
      $ yarn atlaskit-branch-installer 6ce63f22816e --timeout=180000 --interval=10000 --engine=bolt --cmd=upgrade
```
