import { Action } from 'redux';

import { isResetViewAction } from '../actions/resetView';
import { State, SelectedItem, LocalUploads, LocalUpload } from '../domain';

const hasEndOrErrorEvent = (localUpload: LocalUpload) =>
  !!localUpload.events.find(
    event => event.name === 'upload-end' || event.name === 'upload-error',
  );

export default function resetView(state: State, action: Action): State {
  if (isResetViewAction(action)) {
    const selectedItems: SelectedItem[] = [];

    const oldUploads = state.uploads;
    const uploads = Object.keys(oldUploads)
      .filter(uploadId => {
        // remove files that has finished uploading and processing
        return !hasEndOrErrorEvent(oldUploads[uploadId]);
      })
      .reduce<LocalUploads>((uploads, fileIdToKeep) => {
        uploads[fileIdToKeep] = oldUploads[fileIdToKeep];
        return uploads;
      }, {});

    return {
      ...state,
      selectedItems,
      uploads,
    };
  } else {
    return state;
  }
}
