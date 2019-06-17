import { NodeSerializerOpts } from '../interfaces';
import { TableData, createTable, createTag, serializeStyle } from '../util';
import { N30, N50, N0, B400 } from '@atlaskit/adf-schema';

enum TaskState {
  TODO = 'TODO',
  DONE = 'DONE',
}

const whiteSpan = (text: string) =>
  createTag(
    'font',
    {
      color: N0,
      style: serializeStyle({
        'font-color': N0,
      }),
    },
    text,
  );

const iconText: { [K in TaskState]: string } = {
  TODO: whiteSpan('[]'),
  DONE: `✓`,
};

interface TaskItemAttrs {
  state: TaskState;
  localId: string;
}

export default function taskItem({ attrs, text }: NodeSerializerOpts) {
  // If there is no content, we shouldn't render anything
  if (!text) {
    return '';
  }

  const state = (attrs as TaskItemAttrs).state;

  const icon = createTable(
    [
      [
        {
          text: iconText[state],
          style: {
            'font-size': '12px',
            'font-weight': '600',
            'text-align': 'center',
            'background-color': state === TaskState.DONE ? B400 : N0,
            'border-radius': '3px',
            'border-style': 'solid',
            'border-width': state === TaskState.DONE ? '0px' : '1px',
            'border-color': N50,
            color: N0,
            width: '16px',
            height: '16px',
            overflow: 'hidden',
          },
        },
      ],
    ],
    {
      'table-layout': 'fixed',
      'line-height': state === TaskState.DONE ? '20px' : '18px',
    },
  );

  const iconTd: TableData = {
    text: icon,
    style: {
      'vertical-align': 'top',
      padding: '8px',
      width: '20px',
      height: '20px',
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
