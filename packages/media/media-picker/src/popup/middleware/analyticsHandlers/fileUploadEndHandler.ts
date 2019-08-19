import { Action, MiddlewareAPI } from 'redux';
import { TRACK_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { State } from '../../domain';
import { isFileUploadEndAction } from '../../actions/fileUploadEnd';
import { HandlerResult } from '.';

export default (action: Action, store: MiddlewareAPI<State>): HandlerResult => {
  if (isFileUploadEndAction(action)) {
    const { file } = action;

    const { timeStarted } = store.getState().uploads[file.id] || {
      timeStarted: undefined,
    };

    return [
      {
        action: 'uploaded',
        actionSubject: 'mediaUpload',
        actionSubjectId: 'localMedia',
        attributes: {
          fileAttributes: {
            fileSize: file.size,
            fileMimetype: file.type,
            fileId: file.id,
            fileSource: 'mediapicker',
          },
          status: 'success',
          uploadDurationMsec:
            timeStarted !== undefined ? Date.now() - timeStarted : -1,
        },
        eventType: TRACK_EVENT_TYPE,
      },
    ];
  }
};
