import * as React from 'react';
import { RendererContext } from '..';
import { renderNodes, Serializer } from '../..';
import { ExtensionLayout } from '@atlaskit/adf-schema';
import {
  ADNode,
  ExtensionHandlers,
  WidthConsumer,
  overflowShadow,
  OverflowShadowProps,
} from '@atlaskit/editor-common';
import { calcBreakoutWidth } from '@atlaskit/editor-common';
import { RendererCssClassName } from '../../consts';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
  layout?: ExtensionLayout;
}

export const renderExtension = (
  content: any,
  layout: string,
  options?: OverflowShadowProps,
) => {
  let body = (
    <WidthConsumer>
      {({ width }) => (
        <div
          className={RendererCssClassName.EXTENSION}
          style={{
            width: calcBreakoutWidth(layout, width),
            overflowX: 'auto',
          }}
          data-layout={layout}
        >
          {content}
        </div>
      )}
    </WidthConsumer>
  );

  if (options) {
    body = (
      <div ref={options.handleRef} className={options.shadowClassNames}>
        {body}
      </div>
    );
  }
  return body;
};

const Extension: React.StatelessComponent<Props & OverflowShadowProps> = ({
  serializer,
  extensionHandlers,
  rendererContext,
  extensionType,
  extensionKey,
  text,
  parameters,
  layout = 'default',
  handleRef,
  shadowClassNames,
}) => {
  try {
    if (extensionHandlers && extensionHandlers[extensionType]) {
      const content = extensionHandlers[extensionType](
        {
          type: 'extension',
          extensionKey,
          extensionType,
          parameters,
          content: text,
        },
        rendererContext.adDoc,
      );

      switch (true) {
        case content && React.isValidElement(content):
          // Return the content directly if it's a valid JSX.Element
          return renderExtension(content, layout, {
            handleRef,
            shadowClassNames,
          });
        case !!content:
          // We expect it to be Atlassian Document here
          const nodes = Array.isArray(content) ? content : [content];
          return renderNodes(
            nodes as ADNode[],
            serializer,
            rendererContext.schema,
            'div',
          );
      }
    }
  } catch (e) {
    /** We don't want this error to block renderer */
    /** We keep rendering the default content */
  }
  // Always return default content if anything goes wrong
  return renderExtension(text || 'extension', layout, {
    handleRef,
    shadowClassNames,
  });
};

export default overflowShadow(Extension, {
  overflowSelector: `.${RendererCssClassName.EXTENSION}`,
});
