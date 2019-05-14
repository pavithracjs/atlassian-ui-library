import * as React from 'react';
import { Card } from '../src';
import {
  createStorybookMediaClient,
  videoFileId,
  imageFileId,
  videoLargeFileId,
  videoHorizontalFileId,
} from '@atlaskit/media-test-helpers';
import {
  InlineCardVideoWrapper,
  InlineCardVideoWrapperItem,
} from '../example-helpers/styled';

const mediaClient = createStorybookMediaClient();
const onClick = () => console.log('onClick');

export default () => (
  <InlineCardVideoWrapper>
    <InlineCardVideoWrapperItem>
      <h1>video large [disableOverlay=true] width=500 height=300</h1>
      <Card
        mediaClient={mediaClient}
        identifier={videoLargeFileId}
        dimensions={{ width: 500, height: 300 }}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>

    <InlineCardVideoWrapperItem>
      <h1>
        video large [disableOverlay=true] width=500 height=300 (but with
        constraining box of 250px x auto)
      </h1>
      <div style={{ width: '250px', height: 'auto' }}>
        <Card
          mediaClient={mediaClient}
          identifier={videoLargeFileId}
          dimensions={{ width: 500, height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <h1>Image file [disableOverlay=true]</h1>
      <Card
        mediaClient={mediaClient}
        identifier={imageFileId}
        disableOverlay={true}
        onClick={onClick}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <h1>Image file [disableOverlay=true] [useInlinePlayer=true]</h1>
      <Card
        mediaClient={mediaClient}
        identifier={imageFileId}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <h1>video [disableOverlay=true] no dimensions</h1>
      <Card
        mediaClient={mediaClient}
        identifier={videoFileId}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <h1>video [disableOverlay=true] width=100% height=300</h1>
      <Card
        mediaClient={mediaClient}
        identifier={videoFileId}
        dimensions={{ width: '100%', height: 300 }}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <h1>video horizontal [disableOverlay=true] width=500 height=300</h1>
      <Card
        mediaClient={mediaClient}
        identifier={videoHorizontalFileId}
        dimensions={{ width: 500, height: 300 }}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <h1>video horizontal width=200 height=500</h1>
      <Card
        mediaClient={mediaClient}
        identifier={videoHorizontalFileId}
        dimensions={{ width: 200, height: 500 }}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <h1>video horizontal no dimensions</h1>
      <Card
        mediaClient={mediaClient}
        identifier={videoHorizontalFileId}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
  </InlineCardVideoWrapper>
);
