import rafSchedule from 'raf-schd';
import { EditorView } from 'prosemirror-view';
import { Node, DOMSerializer, DOMOutputSpec } from 'prosemirror-model';
import { browser } from '@atlaskit/editor-common';
import {
  createLanguageList,
  DEFAULT_LANGUAGES,
  getLanguageIdentifier,
} from '@atlaskit/adf-schema';
import { changeLanguage } from '../actions';

const MATCH_NEWLINES = new RegExp('\n', 'g');

// For browsers <= IE11, we apply style overrides to render a basic code box
const isIE11 = browser.ie && browser.ie_version <= 11;
const selectDOM = (node: Node) => {
  const options = createLanguageList(DEFAULT_LANGUAGES).map(lang => ({
    label: lang.name,
    value: getLanguageIdentifier(lang),
  }));
  const defaultOption = options.find(opt => opt.value === 'plaintext')!;
  return [
    'div',

    { class: 'code-language-picker-trigger', contentEditable: 'false' },
    [
      'div',
      {},
      (
        options.find(({ value }) => node.attrs.language === value) ||
        defaultOption
      ).label,
    ],
    [
      'select',
      { class: 'code-language-picker' },
      ...options.map(({ value, label }) => [
        'option',
        {
          value,
          ...(node.attrs.language === value ? { selected: true } : {}),
        },
        label,
      ]),
    ],
  ] as DOMOutputSpec;
};

const toDOM = (node: Node) => {
  return [
    'div',
    {
      class: 'code-block' + (isIE11 ? ' ie11' : ''),
      style: 'position: relative',
    },
    ['div', { class: 'line-number-gutter', contenteditable: 'false' }],
    [
      'div',
      { class: 'code-content' },
      [
        'pre',
        [
          'code',
          { 'data-language': node.attrs.language || '', spellcheck: 'false' },
          0,
        ],
      ],
    ],
    selectDOM(node),
  ] as DOMOutputSpec;
};

export class CodeBlockView {
  node: Node;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  lineNumberGutter: HTMLElement;

  private select: HTMLSelectElement;
  private handleSelectValueChange: (evt: Event) => void;
  private handleSelectTriggerClick: (evt: Event) => void;

  constructor(node: Node, view: EditorView, _getPos: () => number) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.lineNumberGutter = this.dom.querySelector(
      '.line-number-gutter',
    ) as HTMLElement;

    this.handleSelectValueChange = evt => {
      const target = evt.target as HTMLSelectElement | null;
      if (!target) {
        return;
      }
      changeLanguage(target.value, view.posAtDOM(this.dom, 1))(
        view.state,
        view.dispatch,
      );
    };
    this.handleSelectTriggerClick = evt => {
      evt.stopPropagation();
    };

    this.ensureLineNumbers();
    this.updateSelectElementsRefs();
    this.addSelectEvents();
  }

  private updateSelectElementsRefs() {
    this.select = this.dom.querySelector(
      '.code-language-picker',
    ) as HTMLSelectElement;
  }

  private removeSelectEvents() {
    this.select.removeEventListener('change', this.handleSelectValueChange);
    this.select.removeEventListener('click', this.handleSelectTriggerClick);
  }

  private addSelectEvents() {
    this.select.addEventListener('change', this.handleSelectValueChange);
    this.select.addEventListener('click', this.handleSelectTriggerClick);
  }

  private ensureLineNumbers = rafSchedule(() => {
    let lines = 1;
    this.node.forEach(node => {
      const text = node.text;
      if (text) {
        lines += (node.text!.match(MATCH_NEWLINES) || []).length;
      }
    });

    while (this.lineNumberGutter.childElementCount < lines) {
      this.lineNumberGutter.appendChild(document.createElement('span'));
    }
    while (this.lineNumberGutter.childElementCount > lines) {
      this.lineNumberGutter.removeChild(this.lineNumberGutter.lastChild!);
    }
  });

  update(node: Node) {
    if (node.type !== this.node.type) {
      return false;
    }
    if (node !== this.node) {
      if (node.attrs.language !== this.node.attrs.language) {
        const { dom } = DOMSerializer.renderSpec(document, selectDOM(node));
        this.contentDOM.setAttribute(
          'data-language',
          node.attrs.language || '',
        );

        const select = this.dom.querySelector('.code-language-picker-trigger');
        if (select) {
          this.removeSelectEvents();
          select.parentNode!.replaceChild(dom, select);
          this.updateSelectElementsRefs();
          this.addSelectEvents();
        }
      }
      this.node = node;
      this.ensureLineNumbers();
    }
    return true;
  }

  stopEvent(evt) {
    if (evt.type === 'input') {
      return true;
    }
  }

  ignoreMutation(record: MutationRecord) {
    // Ensure updating the line-number gutter doesn't trigger reparsing the codeblock
    return (
      record.target === this.lineNumberGutter ||
      record.target.parentNode === this.lineNumberGutter
    );
  }

  destroy() {
    this.removeSelectEvents();
  }
}

export default (node: Node, view: EditorView, getPos: () => number) =>
  new CodeBlockView(node, view, getPos);
