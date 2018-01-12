import fileClick from './fileClick';
import updatePopupUrls from './updatePopupUrls';
import fileListUpdate from './fileListUpdate';
import serviceListUpdate from './serviceListUpdate';
import accountChange from './accountChange';
import accountUnlink from './accountUnlink';
import serviceConnect from './serviceConnect';
import pathChangeRequest from './pathChangeRequest';
import fetchNextCloudFilesPage from './fetchNextCloudFilesPage';
import recentFilesUpdate from './recentFilesUpdate';
import fileUploadsAdd from './fileUploadsAdd';
import filePreviewUpdate from './filePreviewUpdate';
import fileUploadProgress from './fileUploadProgress';
import fileUploadProcessingStart from './fileUploadProcessingStart';
import fileUploadEnd from './fileUploadEnd';
import setEventProxy from './setEventProxy';
import removeEventProxy from './removeEventProxy';
import resetView from './resetView';
import editorClose from './editorClose';
import editorShowError from './editorShowError';
import editorShowImage from './editorShowImage';
import editorShowLoading from './editorShowLoading';
import deselectItem from './deselectItem';
import setTenant from './setTenant';
import isUploading from './isUploading';
import remoteUploadStart from './remoteUploadStart';
import showPopup from './showPopup';
import hidePopup from './hidePopup';
import startApp from './startApp';

const reducers = combineReducers([
  fileClick,
  fileListUpdate,
  pathChangeRequest,
  fetchNextCloudFilesPage,
  serviceListUpdate,
  accountChange,
  serviceConnect,
  accountUnlink,
  recentFilesUpdate,
  updatePopupUrls,
  fileUploadsAdd,
  filePreviewUpdate,
  fileUploadProgress,
  fileUploadProcessingStart,
  fileUploadEnd,
  setEventProxy,
  removeEventProxy,
  resetView,
  editorClose,
  editorShowError,
  editorShowImage,
  editorShowLoading,
  deselectItem,
  setTenant,
  isUploading,
  remoteUploadStart,
  showPopup,
  hidePopup,
  startApp,
]);

function combineReducers(reducers: any) {
  return (state: any, action: any) => {
    return reducers.reduce(
      (oldState: any, reducer: any) => {
        return reducer(oldState, action);
      },
      { ...state },
    );
  };
}

export default reducers;
