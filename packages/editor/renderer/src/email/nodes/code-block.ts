import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle, createTable, TableData } from '../util';

const codeFontStyle = {
  'font-family': `'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace`,
  'font-size': '12px',
  'line-height': '20px',
  'white-space': 'pre',
  'vertical-align': 'top',
};

const codeTagCss = serializeStyle({
  color: 'rgb(23, 43, 77)',
  display: 'block',
});

const preTagCss = serializeStyle({
  background: 'rgb(244, 245, 247)',
  margin: '0px',
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
});

const codeTdStyle = {
  ...codeFontStyle,
  color: 'rgb(23, 43, 77)',
  background: 'rgb(244, 245, 247)',
  width: '100%',
  'padding-right': '8px',
  'padding-left': '8px',
};

const lineNumberTdStyle = {
  ...codeFontStyle,
  color: 'rgb(137, 147, 164)',
  background: 'rgb(235, 236, 240)',
  'padding-right': '8px',
  'padding-left': '8px',
  'font-size': '14px',
  'text-align': 'right',
};

export default function codeBlock({ attrs, text }: NodeSerializerOpts) {
  const codeLines: string[] = (text || '').split('\n');

  const isFirstLine = (index: number): boolean => index === 0;

  const isLastLine = (index: number): boolean => index + 1 === codeLines.length;

  const lineStyle = (index: number) => {
    if (isFirstLine(index)) {
      return { 'padding-top': '8px' };
    }
    if (isLastLine(index)) {
      return { 'padding-bottom': '8px' };
    }
    return {};
  };

  const lineMapper = (codeLine: string, index: number): TableData[] => [
    {
      text: `${index + 1}`,
      style: { ...lineNumberTdStyle, ...lineStyle(index) },
    },
    {
      text: codeLine,
      style: { ...codeTdStyle, ...lineStyle(index) },
    },
  ];

  const codeAsTable = createTable(codeLines.map(lineMapper));
  const codeTag = createTag('code', { style: codeTagCss }, codeAsTable);
  return createTag('pre', { style: preTagCss }, codeTag);
}
