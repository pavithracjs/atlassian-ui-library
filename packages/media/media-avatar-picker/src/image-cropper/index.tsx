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
  containerPadding,
  ImageContainer,
} from './styled';
import { ERROR } from '../avatar-picker-dialog';
import { CONTAINER_INNER_SIZE } from '../image-navigator';

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

  export = (): string => {
    let imageData = '';
    const canvas = document.createElement('canvas');
    const { top, left, scale, containerSize, imageOrientation } = this.props;
    const size = containerSize || 0;
    const scaleWithDefault = scale || 1;
    const destinationSize = Math.max(size - containerPadding * 2, 0);

    canvas.width = destinationSize;
    canvas.height = destinationSize;

    const context = canvas.getContext('2d');

    if (context && this.imageElement) {
      let sourceLeft = (-left + containerPadding) / scaleWithDefault;
      let sourceTop = (-top + containerPadding) / scaleWithDefault;
      let sourceWidth = destinationSize / scaleWithDefault;
      let sourceHeight = destinationSize / scaleWithDefault;

      if (isRotated(imageOrientation)) {
        [sourceLeft, sourceTop] = [sourceTop, sourceLeft];
        [sourceWidth, sourceHeight] = [sourceHeight, sourceWidth];
      }

      switch (imageOrientation) {
        case 2:
          context.translate(sourceWidth, 0);
          context.scale(-1, 1);
          break;
        case 3:
          context.translate(sourceWidth, sourceHeight);
          context.rotate(Math.PI);
          break;
        case 4:
          context.translate(0, sourceHeight);
          context.scale(1, -1);
          break;
        case 5:
          context.rotate(0.5 * Math.PI);
          context.scale(1, -1);
          break;
        case 6:
          context.rotate(0.5 * Math.PI);
          context.translate(0, -sourceHeight);
          break;
        case 7:
          context.rotate(0.5 * Math.PI);
          context.translate(sourceWidth, -sourceHeight);
          context.scale(-1, 1);
          break;
        case 8:
          context.rotate(-0.5 * Math.PI);
          context.translate(-sourceWidth, 0);
          break;
      }

      context.drawImage(
        this.imageElement,
        sourceLeft,
        sourceTop,
        sourceWidth,
        sourceHeight,
        0,
        0,
        destinationSize,
        destinationSize,
      );

      imageData = canvas.toDataURL();
    }

    return imageData;
  };
}

export default injectIntl(ImageCropper);
