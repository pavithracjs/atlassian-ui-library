import { Action, MiddlewareAPI } from 'redux';
import { State } from '../../domain';
import { isHidePopupAction } from '../../actions/hidePopup';
import { buttonClickPayload, HandlerResult } from '.';

export default (action: Action, store: MiddlewareAPI<State>): HandlerResult => {
  if (isHidePopupAction(action)) {
    const storeStates = store.getState();
    const { selectedItems = [] } = storeStates;
    const actionSubjectId =
      selectedItems.length > 0 ? 'insertFilesButton' : 'cancelButton';

    const files =
      actionSubjectId === 'insertFilesButton'
        ? selectedItems.map(item => ({
            fileId: item.id,
            fileMimetype: item.mimeType,
            fileName: item.name,
            fileSize: item.size,
            accountId: item.accountId,
          }))
        : [];

    return [
      {
        ...buttonClickPayload,
        actionSubjectId,
        attributes: {
          fileCount: selectedItems.length,
          ...(actionSubjectId === 'insertFilesButton' ? { files } : {}),
        },
      },
    ];
  }
};
