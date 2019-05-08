import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import StatefulAvatarPickerDialog from '../example-helpers/StatefulAvatarPickerDialog';
import {
  CONTAINER_SIZE,
  viewportInfo,
  CropProperties,
} from '../src/image-navigator';
import { ViewportDebugger } from '../example-helpers/viewport-debug';

interface ExampleState {
  crop: CropProperties;
}

const CropInfoWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;

class Example extends Component<{}, ExampleState> {
  debugView?: ViewportDebugger;

  state = {
    crop: { x: 0, y: 0, size: 0 },
  };

  componentDidMount = () => {
    this.debugView = new ViewportDebugger(
      viewportInfo.instance,
      { x: 10, y: 10 },
      { x: 10, y: CONTAINER_SIZE + 20 },
    );
    viewportInfo.setImage = this.setImage;
  };

  setImage = (image: HTMLImageElement) => {
    if (this.debugView) {
      this.debugView.imageElement = image;
      this.debugView.render();
    }
  };

  onCropChanged = (crop: CropProperties) => {
    this.setState({ crop });
  };

  render() {
    const { crop } = this.state;
    return (
      <>
        <CropInfoWrapper>
          (crop) X: {crop.x} Y: {crop.y} Size: {crop.size}
        </CropInfoWrapper>
        <StatefulAvatarPickerDialog onCropChanged={this.onCropChanged} />
      </>
    );
  }
}

export default () => <Example />;
