// eslint-disable-line no-console
import * as React from 'react';
import { Component, RefObject } from 'react';
import {
  createUploadMediaClient,
  defaultMediaPickerCollectionName,
  I18NWrapper,
} from '@atlaskit/media-test-helpers';
import { MediaPicker } from '../src';
import {
  DropzoneContainer,
  PopupContainer,
  DropzoneContentWrapper,
} from '../example-helpers/styled';
import { intlShape } from 'react-intl';

export interface DropzoneWrapperState {
  isActive: boolean;
}

class DropzoneWrapper extends Component<{}, DropzoneWrapperState> {
  dropzoneRef: RefObject<HTMLDivElement>;

  static mediaClientTypes = {
    intl: intlShape,
  };

  state: DropzoneWrapperState = {
    isActive: true,
  };

  constructor(props: {}) {
    super(props);

    this.dropzoneRef = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(_: any, nextContext: any) {
    if (this.context.intl !== nextContext.intl) {
      this.createMediaPicker(nextContext);
    }
  }

  async createMediaPicker(reactContext: any) {
    if (!this.dropzoneRef.current) {
      return;
    }

    const mediaClient = createUploadMediaClient();
    const dropzone = await MediaPicker('dropzone', mediaClient, {
      container: this.dropzoneRef.current,
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
      proxyReactContext: reactContext,
    });

    dropzone.activate();
  }

  componentDidMount = async () => {
    await this.createMediaPicker(this.context);
  };

  render() {
    const { isActive } = this.state;

    return (
      <PopupContainer>
        <DropzoneContentWrapper>
          <DropzoneContainer isActive={isActive} innerRef={this.dropzoneRef} />
        </DropzoneContentWrapper>
      </PopupContainer>
    );
  }
}

export default () => (
  <I18NWrapper>
    <DropzoneWrapper />
  </I18NWrapper>
);
