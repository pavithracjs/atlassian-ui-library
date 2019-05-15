import * as React from 'react';
import { Component } from 'react';
import { Dispatch, Store } from 'redux';
import { connect, Provider } from 'react-redux';
import { IntlShape } from 'react-intl';
import { MediaClient } from '@atlaskit/media-client';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import {
  UIAnalyticsEventHandlerSignature,
  ObjectType,
} from '@atlaskit/analytics-next';

import { ServiceName, State } from '../domain';

import { BrowserImpl as MpBrowser } from '../../components/browser';
import { DropzoneImpl as MpDropzone } from '../../components/dropzone';
import { ClipboardImpl as MpClipboard } from '../../components/clipboard';
import { UploadParams, PopupConfig } from '../..';

/* Components */
import Footer from './footer/footer';
import Sidebar from './sidebar/sidebar';
import UploadView from './views/upload/upload';
import GiphyView from './views/giphy/giphyView';
import Browser from './views/browser/browser';
import { Dropzone } from './dropzone/dropzone';
import MainEditorView from './views/editor/mainEditorView';

/* Configs */
import { RECENTS_COLLECTION } from '../config';

/* actions */
import { startApp, StartAppActionPayload } from '../actions/startApp';
import { hidePopup } from '../actions/hidePopup';
import { fileUploadsStart } from '../actions/fileUploadsStart';
import { fileUploadPreviewUpdate } from '../actions/fileUploadPreviewUpdate';
import { fileUploadProgress } from '../actions/fileUploadProgress';
import { fileUploadProcessingStart } from '../actions/fileUploadProcessingStart';
import { fileUploadEnd } from '../actions/fileUploadEnd';
import { fileUploadError } from '../actions/fileUploadError';
import { dropzoneDropIn } from '../actions/dropzoneDropIn';
import { dropzoneDragIn } from '../actions/dropzoneDragIn';
import { dropzoneDragOut } from '../actions/dropzoneDragOut';
import PassContext from './passContext';
import {
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadStatusUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
} from '../../domain/uploadEvent';
import { MediaPickerPopupWrapper, SidebarWrapper, ViewWrapper } from './styled';
import {
  DropzoneDragEnterEventPayload,
  DropzoneDragLeaveEventPayload,
} from '../../components/types';
import { LocalUploadComponent } from '../../components/localUpload';

export interface AppStateProps {
  readonly selectedServiceName: ServiceName;
  readonly isVisible: boolean;
  readonly tenantMediaClient: MediaClient;
  readonly userMediaClient: MediaClient;
  readonly config?: Partial<PopupConfig>;
}

export interface AppDispatchProps {
  readonly onStartApp: (payload: StartAppActionPayload) => void;
  readonly onClose: () => void;
  readonly onUploadsStart: (payload: UploadsStartEventPayload) => void;
  readonly onUploadPreviewUpdate: (
    payload: UploadPreviewUpdateEventPayload,
  ) => void;
  readonly onUploadStatusUpdate: (
    payload: UploadStatusUpdateEventPayload,
  ) => void;
  readonly onUploadProcessing: (payload: UploadProcessingEventPayload) => void;
  readonly onUploadEnd: (payload: UploadEndEventPayload) => void;
  readonly onUploadError: (payload: UploadErrorEventPayload) => void;
  readonly onDropzoneDragIn: (fileCount: number) => void;
  readonly onDropzoneDragOut: (fileCount: number) => void;
  readonly onDropzoneDropIn: (fileCount: number) => void;
}

export interface AppProxyReactContext {
  getAtlaskitAnalyticsEventHandlers: () => UIAnalyticsEventHandlerSignature[];
  getAtlaskitAnalyticsContext?: () => ObjectType[];
  intl?: IntlShape;
}

export interface AppOwnProps {
  store: Store<State>;
  tenantUploadParams: UploadParams;
  proxyReactContext?: AppProxyReactContext;
}

export type AppProps = AppStateProps & AppOwnProps & AppDispatchProps;

export interface AppState {
  readonly isDropzoneActive: boolean;
}

export class App extends Component<AppProps, AppState> {
  private readonly mpBrowser: MpBrowser;
  private readonly mpDropzone: MpDropzone;
  private readonly mpClipboard: MpClipboard;
  private readonly localUploader: LocalUploadComponent;

  constructor(props: AppProps) {
    super(props);
    const {
      onStartApp,
      onUploadsStart,
      onUploadPreviewUpdate,
      onUploadStatusUpdate,
      onUploadProcessing,
      onUploadEnd,
      onUploadError,
      tenantMediaClient,
      userMediaClient,
      tenantUploadParams,
    } = props;

    this.state = {
      isDropzoneActive: false,
    };

    // MediaClient that has both auth providers defined explicitly using to provided mediaClients.
    // Each of the local components using this mediaClient will upload first to user's recents
    // and then copy to a tenant's collection.
    const mediaClient = new MediaClient({
      authProvider: tenantMediaClient.config.authProvider,
      userAuthProvider: userMediaClient.config.authProvider,
      cacheSize: tenantMediaClient.config.cacheSize,
    });

    this.localUploader = new LocalUploadComponent(mediaClient, {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
    });

    this.localUploader.on('uploads-start', onUploadsStart);
    this.localUploader.on('upload-preview-update', onUploadPreviewUpdate);
    this.localUploader.on('upload-status-update', onUploadStatusUpdate);
    this.localUploader.on('upload-processing', onUploadProcessing);
    this.localUploader.on('upload-end', onUploadEnd);
    this.localUploader.on('upload-error', onUploadError);

    this.mpBrowser = new MpBrowser(mediaClient, {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
      multiple: true,
    });

    this.mpBrowser.on('uploads-start', onUploadsStart);
    this.mpBrowser.on('upload-preview-update', onUploadPreviewUpdate);
    this.mpBrowser.on('upload-status-update', onUploadStatusUpdate);
    this.mpBrowser.on('upload-processing', onUploadProcessing);
    this.mpBrowser.on('upload-end', onUploadEnd);
    this.mpBrowser.on('upload-error', onUploadError);

    this.mpDropzone = new MpDropzone(mediaClient, {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
      headless: true,
    });
    this.mpDropzone.on('drag-enter', this.onDragEnter);
    this.mpDropzone.on('drag-leave', this.onDragLeave);
    this.mpDropzone.on('uploads-start', this.onDrop);
    this.mpDropzone.on('upload-preview-update', onUploadPreviewUpdate);
    this.mpDropzone.on('upload-status-update', onUploadStatusUpdate);
    this.mpDropzone.on('upload-processing', onUploadProcessing);
    this.mpDropzone.on('upload-end', onUploadEnd);
    this.mpDropzone.on('upload-error', onUploadError);

    this.mpClipboard = new MpClipboard(mediaClient, {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
    });

    this.mpClipboard.on('uploads-start', onUploadsStart);
    this.mpClipboard.on('upload-preview-update', onUploadPreviewUpdate);
    this.mpClipboard.on('upload-status-update', onUploadStatusUpdate);
    this.mpClipboard.on('upload-processing', onUploadProcessing);
    this.mpClipboard.on('upload-end', onUploadEnd);
    this.mpClipboard.on('upload-error', onUploadError);

    onStartApp({
      onCancelUpload: uploadId => {
        this.mpBrowser.cancel(uploadId);
        this.mpDropzone.cancel(uploadId);
        this.localUploader.cancel(uploadId);
      },
    });
  }

  onDragLeave = (payload: DropzoneDragLeaveEventPayload): void => {
    const { onDropzoneDragOut } = this.props;
    onDropzoneDragOut(payload.length);
    this.setDropzoneActive(false);
  };

  onDragEnter = (payload: DropzoneDragEnterEventPayload): void => {
    const { onDropzoneDragIn } = this.props;
    onDropzoneDragIn(payload.length);
    this.setDropzoneActive(true);
  };

  onDrop = (payload: UploadsStartEventPayload): void => {
    const { onDropzoneDropIn, onUploadsStart } = this.props;
    onDropzoneDropIn(payload.files.length);
    onUploadsStart(payload);
  };

  componentWillReceiveProps({ isVisible }: Readonly<AppProps>): void {
    if (isVisible !== this.props.isVisible) {
      if (isVisible) {
        this.mpDropzone.activate();
        this.mpClipboard.activate();
      } else {
        this.mpDropzone.deactivate();
        this.mpClipboard.deactivate();
      }
    }
  }

  componentWillUnmount(): void {
    this.mpDropzone.deactivate();
    this.mpBrowser.teardown();
  }

  render() {
    const {
      selectedServiceName,
      isVisible,
      onClose,
      store,
      proxyReactContext,
    } = this.props;
    const { isDropzoneActive } = this.state;

    return (
      <ModalTransition>
        {isVisible && (
          <Provider store={store}>
            <ModalDialog onClose={onClose} width="x-large" isChromeless={true}>
              <PassContext store={store} proxyReactContext={proxyReactContext}>
                <MediaPickerPopupWrapper>
                  <SidebarWrapper>
                    <Sidebar />
                  </SidebarWrapper>
                  <ViewWrapper>
                    {this.renderCurrentView(selectedServiceName)}
                    <Footer />
                  </ViewWrapper>
                  <Dropzone isActive={isDropzoneActive} />
                  <MainEditorView localUploader={this.localUploader} />
                </MediaPickerPopupWrapper>
              </PassContext>
            </ModalDialog>
          </Provider>
        )}
      </ModalTransition>
    );
  }

  private renderCurrentView(selectedServiceName: ServiceName): JSX.Element {
    if (selectedServiceName === 'upload') {
      // We need to create a new mediaClient since Cards in recents view need user auth
      const { userMediaClient } = this.props;
      return (
        <UploadView
          mpBrowser={this.mpBrowser}
          mediaClient={userMediaClient}
          recentsCollection={RECENTS_COLLECTION}
        />
      );
    } else if (selectedServiceName === 'giphy') {
      return <GiphyView />;
    } else {
      return <Browser />;
    }
  }

  private setDropzoneActive = (isDropzoneActive: boolean) => {
    this.setState({
      isDropzoneActive,
    });
  };
}

const mapStateToProps = ({
  view,
  tenantMediaClient,
  userMediaClient,
  config,
}: State): AppStateProps => ({
  selectedServiceName: view.service.name,
  isVisible: view.isVisible,
  config,
  tenantMediaClient,
  userMediaClient,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): AppDispatchProps => ({
  onStartApp: (payload: StartAppActionPayload) => dispatch(startApp(payload)),
  onUploadsStart: (payload: UploadsStartEventPayload) =>
    dispatch(fileUploadsStart(payload)),
  onClose: () => dispatch(hidePopup()),
  onUploadPreviewUpdate: (payload: UploadPreviewUpdateEventPayload) =>
    dispatch(fileUploadPreviewUpdate(payload)),
  onUploadStatusUpdate: (payload: UploadStatusUpdateEventPayload) =>
    dispatch(fileUploadProgress(payload)),
  onUploadProcessing: (payload: UploadProcessingEventPayload) =>
    dispatch(fileUploadProcessingStart(payload)),
  onUploadEnd: (payload: UploadEndEventPayload) =>
    dispatch(fileUploadEnd(payload)),
  onUploadError: (payload: UploadErrorEventPayload) =>
    dispatch(fileUploadError(payload)),
  onDropzoneDragIn: (fileCount: number) => dispatch(dropzoneDragIn(fileCount)),
  onDropzoneDragOut: (fileCount: number) =>
    dispatch(dropzoneDragOut(fileCount)),
  onDropzoneDropIn: (fileCount: number) => dispatch(dropzoneDropIn(fileCount)),
});

export default connect<AppStateProps, AppDispatchProps, AppOwnProps, State>(
  mapStateToProps,
  mapDispatchToProps,
)(App);
