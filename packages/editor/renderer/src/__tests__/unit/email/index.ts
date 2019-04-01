import { EmailSerializer } from '../../../index';
import { defaultSchema as schema } from '@atlaskit/adf-schema';

import * as paragraphIndents from '../../__fixtures__/paragraph-indents.adf.json';
import * as paragraphAlign from '../../__fixtures__/paragraph-align.adf.json';
import * as headingAlign from '../../__fixtures__/heading-align.adf.json';
import * as em from '../../__fixtures__/em.adf.json';
import * as codeBlock from '../../__fixtures__/code-block.adf.json';
import * as inlineCodeProps from '../../__fixtures__/inline-code-props.adf.json';
import * as inlineTextProps from '../../__fixtures__/inline-text-props.adf.json';
import * as panels from '../../__fixtures__/panels.adf.json';
import * as link from '../../__fixtures__/link.adf.json';
import * as blockCards from '../../__fixtures__/block-cards.adf.json';
import * as inlineCards from '../../__fixtures__/inline-cards.adf.json';
import * as status from '../../__fixtures__/status.adf.json';
import * as tableNumberedColumn from '../../__fixtures__/table-numbered-column.adf.json';
import * as layoutColumnSection from '../../__fixtures__/layout-column-section.adf.json';
import * as extensions from '../../__fixtures__/extensions.adf.json';
import * as mediaSingle from '../../__fixtures__/media-single.adf.json';
import * as mediaGroup from '../../__fixtures__/media-group.adf.json';

import * as image from '../../__fixtures__/image.adf.json';
import * as placeholder from '../../__fixtures__/placeholder.adf.json';
import * as action from '../../__fixtures__/action.adf.json';
import * as annotation from '../../__fixtures__/annotation.adf.json';
import * as breakout from '../../__fixtures__/breakout.adf.json';

const render = (doc: any) => {
  const serializer = EmailSerializer.fromSchema(schema);
  const docFromSchema = schema.nodeFromJSON(doc);
  const serialized = serializer.serializeFragment(docFromSchema.content);
  const node = document.createElement('div');
  node.innerHTML = serialized;
  return node.firstChild;
};

describe('Renderer - EmailSerializer', () => {
  it('should render nothing for image node', () => {
    const output = render(image);
    expect(output).toMatchSnapshot();
  });

  it('should render nothing for placeholder node', () => {
    const output = render(placeholder);
    expect(output).toMatchSnapshot();
  });

  it('should apply no mark for action marks', () => {
    const output = render(action);
    expect(output).toMatchSnapshot();
  });

  it('should apply no mark for annotation marks', () => {
    const output = render(annotation);
    expect(output).toMatchSnapshot();
  });

  it('should apply no mark for breakout marks', () => {
    const output = render(breakout);
    expect(output).toMatchSnapshot();
  });

  it('should render media single correctly', () => {
    const output = render(mediaSingle);
    expect(output).toMatchSnapshot();
  });

  it('should render media group correctly', () => {
    const output = render(mediaGroup);
    expect(output).toMatchSnapshot();
  });

  it('should render block cards correctly', () => {
    const output = render(blockCards);
    expect(output).toMatchSnapshot();
  });

  it('should render inline cards correctly', () => {
    const output = render(inlineCards);
    expect(output).toMatchSnapshot();
  });

  it('should render text with em inside of a paragraph correctly', () => {
    const output = render(em);
    expect(output).toMatchSnapshot();
  });

  it('should render panels correctly', () => {
    const output = render(panels);
    expect(output).toMatchSnapshot();
  });

  it('should align paragraph correctly', () => {
    const output = render(paragraphAlign);
    expect(output).toMatchSnapshot();
  });

  it('should align heading correctly', () => {
    const output = render(headingAlign);
    expect(output).toMatchSnapshot();
  });

  it('should inline text properties correctly', () => {
    const output = render(inlineTextProps);
    expect(output).toMatchSnapshot();
  });

  it('should inline code properties correctly', () => {
    const output = render(inlineCodeProps);
    expect(output).toMatchSnapshot();
  });

  it('should render codeblock correctly', () => {
    const output = render(codeBlock);
    expect(output).toMatchSnapshot();
  });

  it('should render paragraph with indentations', () => {
    const output = render(paragraphIndents);
    expect(output).toMatchSnapshot();
  });

  it('should render link', () => {
    const output = render(link);
    expect(output).toMatchSnapshot();
  });

  it('should render status correctly', () => {
    const output = render(status);
    expect(output).toMatchSnapshot();
  });

  it('should render numbered column for table', () => {
    const output = render(tableNumberedColumn);
    expect(output).toMatchSnapshot();
  });

  it('should render layout column and sections', () => {
    const output = render(layoutColumnSection);
    expect(output).toMatchSnapshot();
  });

  it('should render extension placeholders', () => {
    const output = render(extensions);
    expect(output).toMatchSnapshot();
  });
});
