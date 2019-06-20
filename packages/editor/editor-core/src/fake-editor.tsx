import * as React from 'react';
import { defaultProps, EditorProps } from '@atlaskit/editor-core/editor';
import {
  MediaProviderBase,
  WithViewMediaClientConfig,
} from './plugins/media/types';

export * from './types';

type ModifiedMediaProvider = MediaProviderBase & WithViewMediaClientConfig;

interface ModifiedProps extends EditorProps {
  mediaProvider?: Promise<ModifiedMediaProvider>;
}

export default class Editor extends React.Component<ModifiedProps, {}> {
  defaultProps = defaultProps;
}
