const issues: Record<string, string | undefined> = {
  '999': '',
  '123': 'A short issue title',
  '234': 'Improve typing performance on large documents',
  '345':
    'Copying an image from the web and pastes creates an external image node instead of uploading',
};

const buildCardData = (name: string, url: string) => ({
  '@type': ['Object', 'atlassian:Task'],
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  url,
  generator: {
    '@type': 'Application',
    '@id': 'https://www.atlassian.com/#Jira',
    name: 'Jira',
  },
  isCompleted: false,
  isDeleted: false,
  name,
  taskType: {
    '@type': ['Object', 'atlassian:TaskType'],
    '@id': 'https://www.atlassian.com/#JiraBug',
    name: 'JiraBug',
  },
});

export const autoformattingProvider = {
  getRules: () =>
    Promise.resolve({
      '[Ee][Dd]-(\\d+)': (match: string[]) => {
        const ticketNumber = match[1];
        const ticketTitle = issues[ticketNumber];
        if (ticketTitle === undefined) {
          return Promise.resolve();
        }

        const title =
          `ED-${ticketNumber}` + (ticketTitle.length ? `: ${ticketTitle}` : '');

        return new Promise(resolve => {
          return setTimeout(() => {
            resolve({
              type: 'inlineCard',
              attrs: {
                data: buildCardData(title, 'https://www.atlassian.com/'),
              },
            });
          }, 1000);
        });
      },
    }),
};
