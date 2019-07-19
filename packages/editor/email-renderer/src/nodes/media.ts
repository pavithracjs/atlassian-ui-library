import {
  NodeSerializerOpts,
  MediaMetaDataContextItem,
  MediaType,
} from '../interfaces';
import { createTag } from '../create-tag';
import { N30, B400 } from '@atlaskit/adf-schema';
import { createClassName } from '../styles/util';
import { createContentId, IconString } from '../static';

const className = createClassName('media');
const ICON_DIMENSION = 16;

export default function media(node: NodeSerializerOpts) {
  const { context, attrs } = node;

  // Without metadata, we render a generic lozenge
  if (!context || !context.mediaMetaData || !context.mediaMetaData[attrs.id]) {
    return renderLozenge();
  }

  const metadata = context.mediaMetaData[attrs.id];
  switch (metadata.mediaType) {
    case 'image':
      return renderImage(node, metadata);
    case 'video':
    case 'doc':
      return renderPreview(node, metadata);
    case 'audio':
    case 'unknown':
    default:
      return renderLozenge(metadata);
  }
}

const imageStyles = `
.${className}-wrapper {
  margin: 12px;
  text-align: center;
}
.${className}-img {
  max-width: 100%;
}
`;

const renderImage = (
  { attrs }: NodeSerializerOpts,
  metadata?: MediaMetaDataContextItem,
) => {
  let src;
  if (attrs.id) {
    // ID is defined, render image using CID:
    src = `cid:${attrs.id}`;
  } else if (attrs.url) {
    // url defined, user direct link image
    src = attrs.url;
  }
  if (src) {
    const img = createTag('img', {
      class: `${className}-img`,
      src,
    });
    return createTag('div', { class: `${className}-wrapper` }, img);
  }
  // no id or url found, fall back to lozenge
  return renderLozenge(metadata);
};

const lozengeStyles = `
.${className}-lozenge-wrapper {
  margin: 8px 0;
}
.${className}-lozenge-icon {
  vertical-align: text-bottom;
}
.${className}-lozenge {
  padding: 0 2px;
  line-height: 20px;
  display: inline-block;
  background-color: ${N30};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}
.${className}-lozenge-text {
  color: ${B400};
}
`;

const renderLozenge = (metadata?: MediaMetaDataContextItem) => {
  let iconType;
  let text;
  if (metadata) {
    text = metadata.name || 'Attached file';
    iconType = getIconFromMediaType(metadata.mediaType);
  } else {
    iconType = 'genericAttachment';
    text = 'Attached file';
  }
  const icon = createTag('img', {
    class: className + '-lozenge-icon',
    src: createContentId(iconType as IconString),
    width: `${ICON_DIMENSION}px`,
    height: `${ICON_DIMENSION}px`,
  });

  const iconTag = createTag('span', {}, icon);
  const textTag = createTag(
    'span',
    { class: `${className}-lozenge-text` },
    text,
  );
  const lozenge = createTag(
    'div',
    { class: `${className}-lozenge` },
    iconTag + '&nbsp;' + textTag,
  );
  return createTag('div', { class: `${className}-lozenge-wrapper` }, lozenge);
};

const previewStyles = `
.${className}-preview-img {
  width: 200px;
  height: 120px;
  background-color: white;
  display: block;
  object-fit: cover;
}
.${className}-preview-wrapper {
  margin: 8px 0px;
  padding: 8px;
  background-color: ${N30};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  display: table;
}
.${className}-preview-desc {
  margin-top: 8px;
  line-height: 20px;
  display: inline-block;
  width: 200px;
}
.${className}-preview-text {
  color: ${B400};
  word-break: break-all;
}
`;

const renderPreview = (
  node: NodeSerializerOpts,
  metadata: MediaMetaDataContextItem,
) => {
  const previewImg = createTag('img', {
    class: `${className}-preview-img`,
    src: `cid:${node.attrs.id}`,
  });

  const iconType = getIconFromMediaType(metadata.mediaType);
  const icon = createTag('img', {
    class: className + '-lozenge-icon',
    src: createContentId(iconType as IconString),
    width: `${ICON_DIMENSION}px`,
    height: `${ICON_DIMENSION}px`,
  });
  const iconTag = createTag('span', {}, icon);
  const textTag = createTag(
    'span',
    { class: `${className}-preview-text` },
    metadata.name || 'Attached file',
  );
  const description = createTag(
    'div',
    { class: `${className}-preview-desc` },
    iconTag + '&nbsp;' + textTag,
  );

  return createTag(
    'div',
    { class: `${className}-preview-wrapper` },
    previewImg + description,
  );
};

const getIconFromMediaType = (mediaType: MediaType) => {
  switch (mediaType) {
    case 'archive':
      return 'archiveAttachment';
    case 'audio':
      return 'audioAttachment';
    case 'doc':
      return 'documentAttachment';
    case 'video':
      return 'videoAttachment';
    default:
      return 'genericAttachment';
  }
};

export const styles = `
${imageStyles}
${lozengeStyles}
${previewStyles}
`;
