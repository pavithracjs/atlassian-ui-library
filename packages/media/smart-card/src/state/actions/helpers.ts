import { JsonLd } from '../../client/types';
import { CardBaseActionCreator } from './types';
import { CardStore } from '../types';
import { CardType } from '../store/types';

export const cardAction: CardBaseActionCreator<JsonLd> = (
  type,
  { url },
  payload,
) => ({
  type,
  url,
  payload,
});

export const getByDefinitionId = (
  definitionId: string | undefined,
  store: CardStore,
) => {
  const urls = Object.keys(store);
  return urls.filter(url => {
    const { details } = store[url];
    return details && details.meta.definitionId === definitionId;
  });
};

export const getDefinitionId = (details?: JsonLd) =>
  details && details.meta.definitionId;

export const getServices = (details?: JsonLd) =>
  (details && details.meta.auth) || [];

export const hasResolved = (details?: JsonLd) =>
  details && isAccessible(details) && isVisible(details);

export const isAccessible = ({ meta: { access } }: JsonLd) =>
  access === 'granted';

export const isVisible = ({ meta: { visibility } }: JsonLd) =>
  visibility === 'restricted' || visibility === 'public';

export const getStatus = ({ meta }: JsonLd): CardType => {
  const { access, visibility } = meta;
  switch (access) {
    case 'forbidden':
      if (visibility === 'not_found') {
        return 'not_found';
      } else {
        return 'forbidden';
      }
    case 'unauthorized':
      return 'unauthorized';
    default:
      return 'resolved';
  }
};
