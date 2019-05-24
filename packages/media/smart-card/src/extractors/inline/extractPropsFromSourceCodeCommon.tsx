import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import { AlterInlineProps } from './types';

type AlterInlinePropsSourceCodeName = AlterInlineProps<
  InlineCardResolvedViewProps
>;

// Builds the name for Pull Requests, Branches and Commits.
export const buildName: AlterInlinePropsSourceCodeName = (props, json) => {
  const nextProps = { ...props };
  const link = nextProps.link || json.url;
  if (link) {
    const repository = json['atlassian:repositoryName'] || '';
    const internalId = json['atlassian:internalObjectId'];

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

    return { title: prefix + nextProps.title };
  }

  return nextProps;
};
