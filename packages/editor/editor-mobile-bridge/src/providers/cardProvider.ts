import {
  EditorCardProvider,
  CardAppearance,
  Client,
  ResolveResponse,
} from '@atlaskit/smart-card';
import { createPromise } from '../cross-platform-promise';

export class EditorMobileCardProvider extends EditorCardProvider {
  async resolve(url: string, appearance: CardAppearance): Promise<any> {
    /*
     * Called when a link is pasted inisde
     * return {
     *  type: 'inlineCard', // we always want inline cards for Confluence cards
     *   attrs: {
     *     url: string,
     *   },
      };
     */
    const getLinkResolve = await createPromise(
      'getLinkResolve',
      JSON.stringify({ url, appearance }),
    ).submit();

    if (typeof getLinkResolve === 'object') {
      return getLinkResolve;
    } else {
      return super.resolve(url, appearance);
    }
  }
}

export class MobileSmartCardClient extends Client {
  async fetchData(url: string) {
    const getResolvedLink = await createPromise(
      'getResolvedLink',
      JSON.stringify({ url }),
    ).submit();

    /*
     *
     * This is called when an inlineCard | blockCard is loaded in the document
     * or from the renderer
     * Response from the native side should have the shape of ResolveResponse
     * https://atlaskit.atlassian.com/packages/media/smart-card/docs/client
     *
     */
    if (typeof getResolvedLink === 'object') {
      return getResolvedLink as ResolveResponse;
    } else {
      return super.fetchData(url);
    }
  }
}

export const cardProvider = new EditorMobileCardProvider();
