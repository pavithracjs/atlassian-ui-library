import { Store, Dispatch, Action } from 'redux';
import { State } from '../domain';
import { isRemoveFileFromRecentsAction } from '../actions/removeFileFromRecents';
import { RECENTS_COLLECTION } from '../config';

export const removeFileFromRecents = (store: Store<State>) => (
  next: Dispatch<State>,
) => (action: Action) => {
  if (isRemoveFileFromRecentsAction(action)) {
    console.log({
      userFileId: action.userFileId,
      id: action.id,
    });
    store
      .getState()
      .userMediaClient.collection.removeFile(
        action.userFileId || action.id,
        RECENTS_COLLECTION,
        action.occurrenceKey,
      );
  }

  return next(action);
};
