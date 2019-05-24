import { ReferralContextIdentifiers } from '../components/GlobalQuickSearchWrapper';
import { ConfluenceModelContext } from '../api/types';

export interface ModelParam {
  '@type': string;
  [value: string]: string | number;
}

const commonModelParameters = (queryVersion?: number): ModelParam[] => {
  return queryVersion
    ? [
        {
          '@type': 'queryParams',
          queryVersion,
        },
      ]
    : [];
};

export const jiraModelParams = (
  referralContextIdentifiers?: ReferralContextIdentifiers,
  queryVersion?: number,
): ModelParam[] => {
  const containerId =
    referralContextIdentifiers && referralContextIdentifiers.currentContainerId;

  return [
    ...commonModelParameters(queryVersion),
    ...(containerId
      ? [
          {
            '@type': 'currentProject',
            projectId: containerId,
          },
        ]
      : []),
  ];
};

export const confluenceModelParams = (
  modelContext?: ConfluenceModelContext,
  queryVersion?: number,
): ModelParam[] => {
  return [
    ...commonModelParameters(queryVersion),
    ...(modelContext && modelContext.spaceKey
      ? [
          {
            '@type': 'currentSpace',
            spaceKey: modelContext.spaceKey,
          },
        ]
      : []),
  ];
};
