import { EmojiPluginState, EmojiPluginAction } from '../types';

export default (
  state: EmojiPluginState,
  action: EmojiPluginAction,
): EmojiPluginState => {
  switch (action.type) {
    case 'SET_PROVIDER':
      const { provider, providerHandler } = action;
      return { ...state, provider, providerHandler };
    case 'SET_EMOJIS':
      return { ...state, emojis: action.emojis };
  }
};
