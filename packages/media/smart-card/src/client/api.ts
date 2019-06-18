import { JsonLd } from './types';
export async function request(
  method: string,
  url: string,
  data?: any,
): Promise<JsonLd> {
  const requestConfig = {
    method,
    credentials: 'include' as RequestCredentials,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(url, requestConfig);
    if (response.ok) {
      return await response.json();
    } else {
      throw response;
    }
  } catch (error) {
    if (error.status === 404) {
      return {
        meta: {
          visibility: 'not_found',
          access: 'forbidden',
          auth: [],
          definitionId: 'provider-not-found',
        },
        data: {},
      };
    }
    throw error;
  }
}
