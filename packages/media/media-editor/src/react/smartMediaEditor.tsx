import * as React from 'react';
import uuidV4 from 'uuid/v4';
import { Subscription } from 'rxjs/Subscription';
import {
  intlShape,
  IntlProvider,
  injectIntl,
  InjectedIntlProps,
} from 'react-intl';

import {
  MediaClient,
  UploadableFile,
  FileIdentifier,
} from '@atlaskit/media-client';
import { messages, Shortcut } from '@atlaskit/media-ui';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';

import EditorView from './editorView/editorView';
import { Blanket, SpinnerWrapper } from './styled';
import { fileToBase64 } from '../util';
import ErrorView from './editorView/errorView/errorView';
import { Dimensions } from '../common';

export const convertFileNameToPng = (fileName?: string) => {
  if (!fileName) {
    return 'annotated-image.png';
  }
  if (fileName.endsWith('.png')) {
    return fileName;
  } else {
    if (fileName.lastIndexOf('.') === 0 || fileName.lastIndexOf('.') === -1) {
      return `${fileName}.png`;
    } else {
      return `${fileName.substring(0, fileName.lastIndexOf('.'))}.png`;
    }
  }
};

export interface SmartMediaEditorProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  onUploadStart?: (identifier: FileIdentifier, dimensions: Dimensions) => void;
  onFinish?: (identifier: FileIdentifier) => void;
  onClose?: () => void;
}

export interface SmartMediaEditorState {
  hasError: boolean;
  errorMessage?: any;
  imageUrl?: string;
  hasBeenEdited: boolean;
  closeIntent: boolean;
}

export class SmartMediaEditor extends React.Component<
  SmartMediaEditorProps & InjectedIntlProps,
  SmartMediaEditorState
> {
  fileName?: string;
  state: SmartMediaEditorState = {
    hasError: false,
    hasBeenEdited: false,
    closeIntent: false,
  };
  getFileSubscription?: Subscription;
  uploadFileSubscription?: Subscription;

  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    const { identifier } = this.props;
    this.getFile(identifier);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<SmartMediaEditorProps>) {
    const { identifier, mediaClient } = this.props;
    if (
      nextProps.identifier.id !== identifier.id ||
      nextProps.mediaClient !== mediaClient
    ) {
      this.getFile(nextProps.identifier);
    }
  }

  componentWillUnmount() {
    const { getFileSubscription, uploadFileSubscription } = this;
    if (getFileSubscription) {
      getFileSubscription.unsubscribe();
    }
    if (uploadFileSubscription) {
      uploadFileSubscription.unsubscribe();
    }
  }

  getFile = async (identifier: FileIdentifier) => {
    const { mediaClient } = this.props;
    const { collectionName, occurrenceKey } = identifier;
    const id = await identifier.id;
    const getFileSubscription = mediaClient.file
      .getFileState(id, { collectionName, occurrenceKey })
      .subscribe({
        next: async state => {
          if (state.status === 'error') {
            this.onError(state.message);
            setTimeout(() => getFileSubscription.unsubscribe(), 0);
            return;
          }

          const { name, preview, status } = state;
          this.fileName = name;

          if (status === 'processed') {
            this.setRemoteImageUrl(identifier);
            setTimeout(() => getFileSubscription.unsubscribe(), 0);
          } else if (preview) {
            const { value } = await preview;
            if (value instanceof Blob) {
              const imageUrl = await fileToBase64(value);
              this.setState({
                imageUrl,
              });
            } else {
              this.setState({
                imageUrl: value,
              });
            }

            setTimeout(() => getFileSubscription.unsubscribe(), 0);
          }
        },
        error: error => {
          this.onError(error);
        },
      });
    this.getFileSubscription = getFileSubscription;
  };

  setRemoteImageUrl = async (identifier: FileIdentifier) => {
    const { mediaClient } = this.props;
    const id = await identifier.id;
    const imageUrl = await mediaClient.getImageUrl(id, {
      collection: identifier.collectionName,
      mode: 'full-fit',
    });
    this.setState({
      imageUrl,
    });
  };

  copyFileToUserCollection = async (fileId: string) => {
    const {
      mediaClient: {
        config: { userAuthProvider, authProvider },
        file,
      },
      identifier: { collectionName },
    } = this.props;

    if (userAuthProvider) {
      const source = {
        id: fileId,
        collection: collectionName,
        authProvider,
      };
      const destination = {
        collection: 'recents',
        authProvider: userAuthProvider,
        occurrenceKey: uuidV4(),
      };
      await file.copyFile(source, destination);
    }
  };

  private onSave = (imageData: string, dimensions: Dimensions) => {
    const { fileName } = this;
    const {
      mediaClient,
      identifier,
      onUploadStart,
      onFinish,
      intl: { formatMessage },
    } = this.props;

    const { collectionName } = identifier;
    const uploadableFile: UploadableFile = {
      content: imageData,
      collection: collectionName,
      name: convertFileNameToPng(fileName),
    };
    const id = uuidV4();
    const occurrenceKey = uuidV4();
    const touchedFiles = mediaClient.file.touchFiles(
      [
        {
          fileId: id,
          collection: collectionName,
          occurrenceKey,
        },
      ],
      collectionName,
    );
    const deferredUploadId = touchedFiles.then(
      touchedFiles => touchedFiles.created[0].uploadId,
    );
    const uploadableFileUpfrontIds = {
      id,
      deferredUploadId,
      occurrenceKey,
    };

    const uploadingFileState = mediaClient.file.upload(
      uploadableFile,
      undefined,
      uploadableFileUpfrontIds,
    );
    const newFileIdentifier: FileIdentifier = {
      id,
      collectionName,
      mediaItemType: 'file',
      occurrenceKey,
    };
    const uploadingFileStateSubscription = uploadingFileState.subscribe({
      next: fileState => {
        if (fileState.status === 'processing') {
          this.copyFileToUserCollection(fileState.id).then(() => {
            if (onFinish) {
              onFinish(newFileIdentifier);
            }
            setTimeout(() => uploadingFileStateSubscription.unsubscribe(), 0);
          });
        } else if (
          fileState.status === 'failed-processing' ||
          fileState.status === 'error'
        ) {
          this.onError(formatMessage(messages.could_not_save_image));
          setTimeout(() => uploadingFileStateSubscription.unsubscribe(), 0);
        }
      },
    });
    if (onUploadStart) {
      onUploadStart(newFileIdentifier, dimensions);
    }
  };

  private onAnyEdit = () => {
    const { hasBeenEdited } = this.state;
    if (!hasBeenEdited) {
      this.setState({ hasBeenEdited: true });
    }
  };

  private closeConfirmationDialog = () => {
    this.setState({ closeIntent: false });
  };

  private closeAnyway = () => {
    const { onClose } = this.props;
    this.closeConfirmationDialog();
    if (onClose) {
      onClose();
    }
  };

  private renderDeleteConfirmation = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    const { closeIntent } = this.state;

    if (closeIntent) {
      const actions = [
        {
          text: formatMessage(messages.annotate_confirmation_close_anyway),
          onClick: this.closeAnyway,
        },
        {
          text: formatMessage(messages.cancel),
          onClick: this.closeConfirmationDialog,
        },
      ];
      return (
        <ModalTransition>
          <ModalDialog
            width="small"
            appearance="danger"
            heading={formatMessage(messages.annotate_confirmation_heading)}
            actions={actions}
            onClose={this.closeConfirmationDialog}
          >
            {formatMessage(messages.annotate_confirmation_content)}
          </ModalDialog>
        </ModalTransition>
      );
    }
    return null;
  };

  onCancel = () => {
    const { hasBeenEdited } = this.state;
    const { onClose } = this.props;
    if (hasBeenEdited) {
      this.setState({ closeIntent: true });
    } else if (onClose) {
      onClose();
    }
  };

  onError = (error: any) => {
    this.setState({
      hasError: true,
      errorMessage: error,
    });
  };

  private clickShellNotPass = (e: React.SyntheticEvent<HTMLDivElement>) => {
    // Stop click from propagating back to the editor.
    // Without it editor will get focus and apply all the key events
    e.stopPropagation();
  };

  renderLoading = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="large" invertColor={true} />
      </SpinnerWrapper>
    );
  };

  renderEditor = (imageUrl: string) => {
    return (
      <EditorView
        imageUrl={imageUrl}
        onSave={this.onSave}
        onCancel={this.onCancel}
        onError={this.onError}
        onAnyEdit={this.onAnyEdit}
      />
    );
  };

  renderError = (error: any) => {
    const { onClose } = this.props;
    if (error instanceof Error) {
      error = error.message;
    }
    return <ErrorView message={error} onCancel={onClose || (() => {})} />;
  };

  render() {
    const { imageUrl, hasError, errorMessage } = this.state;

    const content = hasError
      ? this.renderError(errorMessage)
      : imageUrl
      ? this.renderEditor(imageUrl)
      : this.renderLoading();

    return (
      <Blanket onClick={this.clickShellNotPass}>
        {this.renderDeleteConfirmation()}
        <Shortcut keyCode={27} handler={this.onCancel} />
        {content}
      </Blanket>
    );
  }
}

export default class extends React.Component<SmartMediaEditorProps> {
  render() {
    const Component = injectIntl(SmartMediaEditor);
    const content = <Component {...this.props} />;
    return this.context.intl ? (
      content
    ) : (
      <IntlProvider locale="en">{content}</IntlProvider>
    );
  }
}
