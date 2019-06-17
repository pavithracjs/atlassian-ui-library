import { NodeSerializerOpts } from '../interfaces';
import { TableData, createTable, createTag, serializeStyle } from '../util';
import { N30 } from '@atlaskit/adf-schema';
import { createContentId } from '../static';

enum DecisionState {
  DECIDED = 'DECIDED',
}

const icons: { [K in DecisionState]: string } = {
  DECIDED: createTag('img', {
    style: serializeStyle({
      width: '16px',
      height: '16px',
    }),
    src: createContentId('decision', 'icon'),
  }),
};

interface DecisionItemAttrs {
  state: DecisionState;
  localId: string;
}

export default function decisionItem({ attrs, text }: NodeSerializerOpts) {
  // If there is no content, we shouldn't render anything
  if (!text) {
    return '';
  }

  const state = (attrs as DecisionItemAttrs).state;

  const iconTd: TableData = {
    text: icons[state],
    style: {
      'vertical-align': 'top',
      padding: '8px 0px 8px 8px',
      width: '24px',
      height: '24px',
    },
  };

  const textTd: TableData = {
    text,
    style: {
      'font-size': '14px',
      padding: '8px 8px 8px 0',
    },
  };

  const mainContentTable = createTable([[iconTd, textTd]], {
    'background-color': N30,
    'border-radius': '3px',
    'table-layout': 'fixed',
    'line-height': '20px',
  });

  return createTable([
    [
      {
        text: mainContentTable,
        style: {
          padding: '4px 0px 4px 0',
        },
      },
    ],
  ]);
}
