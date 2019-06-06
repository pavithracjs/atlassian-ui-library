import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';

// TODO: change this:
//  commits no longer have internalId
//  the # for PRs no longer exists

// Builds the name for Pull Requests, Branches and Commits.
export const buildName = (
  props: InlineCardResolvedViewProps,
  json: any,
  internalId = '',
) => {
  const nextProps = { ...props };
  const link = nextProps.link || json.url;
  if (link) {
    const repository = (json.context && json.context.name) || '';

    // We need to handle some different cases here:
    //  repoName + internalId: `repo-name/internal-id: title`
    //  only internalId:       `internal-id: title`
    //  only repoName:         `repo-name: title`
    //  neither:               `title`
    let prefix = '';
    if (repository && internalId) {
      prefix = `${repository}/${internalId}: `;
    } else if (repository || internalId) {
      prefix = `${repository || internalId}: `;
    }

    const title = prefix + nextProps.title;
    return { title };
  }

  return nextProps;
};
