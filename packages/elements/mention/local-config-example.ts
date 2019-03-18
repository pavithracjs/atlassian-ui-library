// in PUG
const testCloudId = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';

// Copy this file to local-config.ts and customise.
export default {
  asap: {
    url: 'http://www.example.org/mentions',
    securityProvider: () => ({
      headers: {
        'X-Bogus-Authorization': 'Bearer asap_token',
      },
      omitCredentials: true,
    }),
  },
  sessionservice: {
    url: 'http://www.example.org/mentions/some-cloud-id',
    productId: 'micros-group/confluence',
    securityProvider: () => ({
      headers: {
        'X-Bogus-Authorization': 'Session-bearer session_service_token',
      },
    }),
  },
  sessionServiceWithTeam: {
    user: {
      url: `https://api-private.stg.atlassian.com/mentions/${testCloudId}`,
      productId: 'micros-group/confluence',
      securityProvider: () => ({
        headers: {
          'X-Bogus-Authorization': 'Session-bearer session_service_token',
        },
      }),
    },
    team: {
      url: 'https://api-private.stg.atlassian.com/teams/mentions',
      productId: 'micros-group/confluence',
      securityProvider: () => ({
        headers: {
          'X-Bogus-Authorization': 'Session-bearer session_service_token',
        },
      }),
    },
  },
};
