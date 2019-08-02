#! /usr/bin/env bash

# Pull translations from Transifex
set -e # Ask Tung why these are needed
set -u
set -x

# IF not editor changeset
# exit 0;

if  grep -q -R "@atlaskit/editor-core" ./.changeset
then 
   echo "Found editor-core changeset on branch so installing";
else
   echo "No editor-core changeset on branch, so not installing branch-deploy"
   exit 0;
fi

# create a new branch
TEMP_BRANCH_NAME="atlaskit-branch-deploy/${bamboo_planRepository_branch}"

# Check if branch already exists first
git checkout -b "${TEMP_BRANCH_NAME}"

# !!!!!!! Luke's CLI tool here !!!!!!!
bolt upgrade @atlaskit/editor-core@"https://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts/50c5ba48b910/dists/atlaskit-editor-core-112.39.15.tgz"

git status

git add .

if [ "$(git diff-index --quiet --cached HEAD --; echo $?)" -eq 1 ]; then
  #! /usr/bin/env bash

createPRFromBranch() {
  local -r branchName="${1}"

  local -r stashUrl="https://stash.atlassian.com"
  local -r userName="${bamboo_build_doctor_username}"
  local -r password="${bamboo_build_doctor_password}"
  local -r stashProjectKey="CONFCLOUD"
  local -r stashRepoSlug="confluence-frontend"

  # This opens a PR and adds the bartenders to it. See here for reference
  # https://developer.atlassian.com/static/rest/bitbucket-server/5.3.1/bitbucket-rest.html#idm45682777077712
  curl -u "${userName}:${password}" -H "Content-Type: application/json" -X POST "${stashUrl}/rest/api/1.0/projects/${stashProjectKey}/repos/${stashRepoSlug}/pull-requests" \
    -d "{
        \"title\": \"${branchName}\",
        \"description\": \"Update translations from Transifex by this Bamboo build: ${bamboo_buildResultsUrl}\",
        \"state\": \"OPEN\",
        \"open\": true,
        \"closed\": false,
        \"fromRef\": {
            \"id\": \"refs/heads/${branchName}\",
            \"repository\": {
                \"slug\": \"${stashRepoSlug}\",
                \"name\": null,
                \"project\": {
                    \"key\": \"${stashProjectKey}\"
                }
            }
        },
        \"toRef\": {
            \"id\": \"refs/heads/master\",
            \"repository\": {
                \"slug\": \"${stashRepoSlug}\",
                \"name\": null,
                \"project\": {
                    \"key\": \"${stashProjectKey}\"
                }
            }
        },
        \"locked\": false,
        \"reviewers\": [
            {
                \"user\": {
                    \"name\": \"lbatchelor\"
                }
            },
            {
                \"user\": {
                    \"name\": \"mdejongh\"
                }
            }
        ],
        \"links\": {
            \"self\": [
                null
            ]
        }
    }"
}

createCommitAndPublish() {
  local -r branchName="$(git branch | grep '^*' | sed s/\*\ //)"

  if [[ "${branchName}" = "master" ]]; then
    echo "Should not commit in master branch."
    exit 1;
  fi

  echo "Current branch is ${branchName}"
  git status

  git commit -m "${branchName} - Automatically pulling in branch-deploy ${bamboo_buildResultsUrl}"

  #local -r remoteUrl="${bamboo_planRepository_2_repositoryUrl}"
  # TODO CHECK THAT IT'S NEVER EVER ATLASKIT-MK-2 here
  local -r remoteUrl="ssh://git@stash.atlassian.com:7997/confcloud/confluence-frontend.git"
  
  echo "Setting git remote to ${remoteUrl}"
  git remote set-url origin $remoteUrl
  echo $remoteUrl
  git remote get-url origin
  git push -u origin "${branchName}"

  createPRFromBranch "${branchName}"
}

  echo "Branch deploy has been installed, pushing..."
  createCommitAndPublish
  echo "Successfully pushed branch deploy"

else
  echo "No branch deploy; nothing to do"

  # clean up temporary branch
  git checkout master
  git branch -D "${TEMP_BRANCH_NAME}"
fi