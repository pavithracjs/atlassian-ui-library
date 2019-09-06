# `@atlaskit/branch-deploy-product-integrator`

This is a CLI for automatically creating branches installing Atlaskit branch deploys in products.

## CLI Flags
`--branchPrefix`       Prefix for the generated branch [default=atlaskit-branch-deploy/]

`--workingPath`    Working path of the product repo installing a branch in [default=./]

`--atlaskitCommitHash`       Atlaskit commit hash of the branch deploy that needs to be installed

`--atlaskitBranchName` The branch with which to compare the current branch, when git reporting is enabled can detect PR target branch. [default=master]

`--packageEngine` The package manager to use, currently only tested with Bolt and yarn [default=yarn]

`--packages` comma delimited list of packages to install branch deploy of

`--dedupe` !yarn only! run yarn deduplicate at the end to deduplicate the lock file 


## Bamboo example implementation: 

1. Create a build plan that is linked to the Atlaskit repo AND the product repo. 
2. Check out Atlaskit repo in the root 
3. Check out the product repo in a sub-dir and make sure it has write-rights. 
4. Then run the following shell script in the sub-dir of the product checkout:

```sh
branch_name=${bamboo_planRepository_branch}
if [ "$branch_name" != "master" ]; then

yarn global add atlaskit-branch-deploy-product-integrator

branch-deploy-product-integrator --atlaskitBranchName ${bamboo_planRepository_branch} --atlaskitCommitHash ${bamboo_planRepository_revision}
else
echo "Current branch is master. Not going to branch deploy."
fi
```

**Note:** There's a protection against accidentally pushing to the wrong repo. If that throws most likely the order of the repo's on the build plans is incorrect. Also sometimes the repo will not have a remote setup, if that is the case add this to the start of the build script:

```sh
git remote set-url origin ssh://git@my.stash.instance.com/productproject/productrepo.git
```
