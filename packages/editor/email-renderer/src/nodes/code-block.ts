import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createTable } from '../table-util';
import { createClassName } from '../styles/util';
import { codeFontFamily } from '../styles/common';
import { N20 } from '@atlaskit/adf-schema';

export const styles = `
.${createClassName('codeBlock-code')} {
  color: rgb(23, 43, 77);
  display: block;
  font-size: 12px;
  line-height: 20px;
  white-space: pre-wrap;
  font-family: ${codeFontFamily};
}
.${createClassName('codeBlock-pre')} {
  background: ${N20};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  margin: 0px;
  white-space: pre-line;
}
.${createClassName('codeBlock-td')} {
  padding: 8px 16px;
  background-color: ${N20};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  font-size: 12px;
  line-height: 20px;
  color: rgb(23, 43, 77);
}
`;

export default function codeBlock({ text }: NodeSerializerOpts) {
  const sanitizedText = (text || '').replace(/\n/g, '<br/>');
  const codeTag = createTag(
    'code',
    { class: `${createClassName('codeBlock-code')}` },
    sanitizedText,
  );
  const codeTagWithTable = createTable([
    [
      {
        text: codeTag,
        attrs: {
          class: `${createClassName('codeBlock-td')}`,
        },
      },
    ],
  ]);
  return createTag(
    'pre',
    { class: `${createClassName('codeBlock-pre')}` },
    codeTagWithTable,
  );
}
