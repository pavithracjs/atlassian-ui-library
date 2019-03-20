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
    let destinationWidth = destinationSize;
    let destinationHeight = destinationSize;

    canvas.width = destinationWidth;
    canvas.height = destinationHeight;

    const context = canvas.getContext('2d');

    if (context && this.imageElement) {
      const sourceImageWidth = this.width / scaleWithDefault;
      const sourceImageHeight = this.height / scaleWithDefault;
      let sourceLeft = (containerPadding - left) / scaleWithDefault;
      let sourceTop = (containerPadding - top) / scaleWithDefault;
      let sourceWidth = destinationWidth / scaleWithDefault;
      let sourceHeight = destinationHeight / scaleWithDefault;
      const sourceRight = sourceImageWidth - sourceWidth - sourceLeft;
      const sourceBottom = sourceImageHeight - sourceHeight - sourceTop;

      const cw180 = Math.PI;
      const cw90 = Math.PI / 2;
      const ccw90 = -Math.PI / 2;

      // Here we solve two problems:
      // 1. At this point sourceLeft and sourceTop based on target orientation of an image.
      //    Those represent what user has chosen as a top left corner. We need to convert
      //    these into top and left corner of the same rect, but in original image. We will
      //    use these new coordinates when we read from original image.
      //
      // 2. Perform affine transformation for canvas to orientate extracted part of an original image.

      switch (imageOrientation) {
        case 2:
          [sourceLeft, sourceTop] = [sourceRight, sourceTop];

          context.translate(sourceWidth, 0);
          context.scale(-1, 1);
          break;
        case 3:
          [sourceLeft, sourceTop] = [sourceRight, sourceBottom];

          context.translate(sourceWidth, sourceHeight);
          context.rotate(cw180);
          break;
        case 4:
          [sourceLeft, sourceTop] = [sourceLeft, sourceBottom];

          context.translate(0, sourceHeight);
          context.scale(1, -1);
          break;
        case 5:
          [sourceLeft, sourceTop] = [sourceTop, sourceLeft];

          context.rotate(cw90);
          context.scale(1, -1);
          break;
        case 6:
          [sourceLeft, sourceTop] = [sourceTop, sourceRight];

          context.translate(destinationWidth, 0);
          context.rotate(cw90);
          break;
        case 7:
          [sourceLeft, sourceTop] = [sourceBottom, sourceRight];

          context.translate(destinationWidth, destinationHeight);
          context.rotate(ccw90);
          context.scale(1, -1);
          break;
        case 8:
          [sourceLeft, sourceTop] = [sourceBottom, sourceLeft];

          context.translate(0, destinationHeight);
          context.rotate(ccw90);
          break;
      }

      if (isRotated(imageOrientation)) {
        [sourceWidth, sourceHeight] = [sourceHeight, sourceWidth];
        [destinationHeight, destinationWidth] = [
          destinationWidth,
          destinationHeight,
        ];
      }

      context.drawImage(
        this.imageElement,
        sourceLeft,
        sourceTop,
        sourceWidth,
        sourceHeight,
        0,
        0,
        destinationWidth,
        destinationHeight,
      );

      imageData = canvas.toDataURL();
    }

    return imageData;
  };
}

export default injectIntl(ImageCropper);
