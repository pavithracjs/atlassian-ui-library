import { NodeSerializerOpts } from '../interfaces';
import { TableData, createTable } from '../util';
import { G300, N30 } from '@atlaskit/adf-schema';

enum DecisionState {
  DECIDED = 'DECIDED',
}

const icons: { [K in DecisionState]: string } = {
  DECIDED: '↖',
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

  const icon = createTable(
    [
      [
        {
          text: icons[state],
          style: {
            'font-size': '13px',
            'font-weight': '900',
            'text-align': 'center',
            color: G300,
            width: '16px',
            height: '16px',
          },
        },
      ],
    ],
    {
      'table-layout': 'fixed',
      'line-height': '18px',
    },
  );

  const iconTd: TableData = {
    text: icon,
    style: {
      'vertical-align': 'top',
      padding: '9px',
      width: '16px',
      height: '16px',
    },
  };

  const textTd: TableData = {
    text,
    style: {
      'font-size': '14px',
      padding: '8px 0px 8px 0',
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
