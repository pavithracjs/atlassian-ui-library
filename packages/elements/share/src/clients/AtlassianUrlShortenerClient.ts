import memoizeOne from 'memoize-one';
import { ProductId } from '../types';

export interface ShortenRequest {
  path: string;
  cloudId: string;
  product: 'jira' | 'confluence';
}

export interface ShortenResponse {
  shortLink: string;
}

export interface UrlShortenerClient {
  isSupportedProduct(product: ProductId): boolean;
  shorten(
    fullUrl: string,
    cloudId: string,
    product: ProductId,
  ): Promise<ShortenResponse>;
}

function coalesceProductIdToUrlShortenerProduct(
  product: ProductId,
): ShortenRequest['product'] | undefined {
  switch (product) {
    case 'confluence':
      return 'confluence';
    case 'jira-software':
    case 'jira-core':
    case 'jira-servicedesk':
      return 'jira';
    default:
      return undefined;
  }
}

const warnProductNotSupported = memoizeOne((productId: string) => {
  const isProduction: boolean = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    console.warn(
      `elements/share: product "${productId}" is not supported by the URL Shortener!`,
    ); // eslint-disable-line no-console
  }
});

export class AtlassianUrlShortenerClient implements UrlShortenerClient {
  public isSupportedProduct(product: ProductId): boolean {
    return !!coalesceProductIdToUrlShortenerProduct(product);
  }

  public async shorten(
    fullLink: string,
    cloudId: string,
    productId: ProductId,
  ): Promise<ShortenResponse> {
    try {
      const product = coalesceProductIdToUrlShortenerProduct(productId);

      if (!product) {
        warnProductNotSupported(productId);
        return {
          shortLink: fullLink,
        };
      }

      const response = await fetch('/gateway/api/atl-link/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: fullLink,
          cloudId,
          product,
        }),
      });

      if (!response.ok) throw new Error(`status="${response.status}"`);

      return response.json();
    } catch (err) {
      err.message = `While shortening URL: ${err.message}!`;
      throw err;
    }
  }
}
