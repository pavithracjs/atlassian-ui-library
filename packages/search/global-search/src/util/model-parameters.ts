import { ReferralContextIdentifiers } from '../components/GlobalQuickSearchWrapper';
import { ConfluenceModelContext } from '../api/types';

export interface ModelParam {
  '@type': string;
  [value: string]: string | number;
}

const buildCommonModelParameters = (queryVersion?: number): ModelParam[] => {
  return queryVersion
    ? [
        {
          '@type': 'queryParams',
          queryVersion,
        },
      ]
    : [];
};

export const buildJiraModelParams = (
  referralContextIdentifiers?: ReferralContextIdentifiers,
  queryVersion?: number,
): ModelParam[] => {
  const containerId =
    referralContextIdentifiers && referralContextIdentifiers.currentContainerId;

  return [
    ...buildCommonModelParameters(queryVersion),
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

export const buildConfluenceModelParams = (
  modelContext?: ConfluenceModelContext,
  queryVersion?: number,
): ModelParam[] => {
  return [
    ...buildCommonModelParameters(queryVersion),
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
