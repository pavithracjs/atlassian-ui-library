import * as React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { messages, isRotated, MediaImage } from '@atlaskit/media-ui';
import { isImageRemote } from './isImageRemote';
import {
  CircularMask,
  Container,
  DragOverlay,
  RectMask,
  RemoveImageContainer,
  RemoveImageButton,
  ImageContainer,
} from './styled';
import { ERROR } from '../avatar-picker-dialog';
import { CONTAINER_INNER_SIZE } from '../image-navigator';
import cropToDataURI from './crop-to-data-uri';

export interface LoadParameters {
  export: () => string;
}

export type OnLoadHandler = (params: LoadParameters) => void;

export interface ImageCropperProp {
  imageSource: string;
  scale?: number; // Value from 0 to 1
  containerSize?: number;
  isCircularMask?: boolean;
  top: number;
  left: number;
  imageWidth?: number;
  imageOrientation: number;
  onDragStarted?: (x: number, y: number) => void;
  onImageSize: (width: number, height: number) => void;
  onLoad?: OnLoadHandler;
  onRemoveImage: () => void;
  onImageError: (errorMessage: string) => void;
}

export interface State {
  naturalWidth?: number;
  naturalHeight?: number;
}

const defaultScale = 1;

export class ImageCropper extends Component<
  ImageCropperProp & InjectedIntlProps,
  State
> {
  private imageElement?: HTMLImageElement;
  state: State = {};

  static defaultProps = {
    containerSize: CONTAINER_INNER_SIZE,
    isCircleMask: false,
    scale: defaultScale,
    onDragStarted: () => {},
    onImageSize: () => {},
  };

  componentDidMount() {
    const {
      onLoad,
      imageSource,
      onImageError,
      intl: { formatMessage },
    } = this.props;
    if (onLoad) {
      onLoad({
        export: this.export,
      });
    }
    try {
      isImageRemote(imageSource);
    } catch (e) {
      onImageError(formatMessage(ERROR.URL));
    }
  }

  onDragStarted = (e: React.MouseEvent<{}>) => {
    if (this.props.onDragStarted) {
      this.props.onDragStarted(e.screenX, e.screenY);
    }
  };

  onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const image = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = image;
    this.setState({ naturalWidth, naturalHeight });
    this.props.onImageSize(naturalWidth, naturalHeight);
    this.imageElement = image;
  };

  onImageError = () => {
    const {
      onImageError,
      intl: { formatMessage },
    } = this.props;
    onImageError(formatMessage(ERROR.FORMAT));
  };

  render() {
    const {
      isCircularMask,
      containerSize,
      top,
      left,
      imageSource,
      onRemoveImage,
      imageOrientation,
      intl: { formatMessage },
    } = this.props;
    const containerStyle = {
      width: `${containerSize}px`,
      height: `${containerSize}px`,
    };
    const width = this.width ? `${this.width}px` : 'auto';
    const height = this.height ? `${this.height}px` : 'auto';

    const imageContainerStyle = {
      width,
      height,
      display: width === 'auto' ? 'none' : 'block',
      top: `${top}px`,
      left: `${left}px`,
    };

    return (
      <Container style={containerStyle}>
        <ImageContainer style={imageContainerStyle}>
          <MediaImage
            dataURI={imageSource}
            crop={false}
            stretch={true}
            previewOrientation={imageOrientation}
            onImageLoad={this.onImageLoaded}
            onImageError={this.onImageError}
          />
        </ImageContainer>
        {isCircularMask ? <CircularMask /> : <RectMask />}
        <DragOverlay onMouseDown={this.onDragStarted} />
        <RemoveImageContainer>
          <RemoveImageButton onClick={onRemoveImage}>
            <CrossIcon
              size="small"
              label={formatMessage(messages.remove_image)}
            />
          </RemoveImageButton>
        </RemoveImageContainer>
      </Container>
    );
  }

  private get width() {
    const { imageWidth, scale } = this.props;

    return imageWidth ? imageWidth * (scale || defaultScale) : 0;
  }

  private get height() {
    const { naturalHeight, naturalWidth } = this.state;
    if (!naturalWidth || !naturalHeight) {
      return 0;
    }

    const { imageOrientation } = this.props;

    const [newNaturalHeight, newNaturalWidth] = isRotated(imageOrientation)
      ? [naturalWidth, naturalHeight]
      : [naturalHeight, naturalWidth];

    return (newNaturalHeight * this.width) / newNaturalWidth;
  }

  private cropOut = () => {
    const {
      top,
      left,
      scale = 1,
      containerSize = 0,
      imageOrientation,
    } = this.props;
    if (this.imageElement && containerSize) {
      return cropToDataURI(
        this.imageElement,
        { width: this.width, height: this.height, top: 0, left: 0 },
        { top, left, width: containerSize, height: containerSize },
        scale,
        imageOrientation,
      );
    }
    return '';
  };

  export = (): string => {
    return this.cropOut();
  };
}

export default injectIntl(ImageCropper);
