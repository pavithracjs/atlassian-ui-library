import { NodeSerializerOpts } from '../interfaces';
import { TableData, createTable } from '../util';
import { N30, N50, N0, B400 } from '@atlaskit/adf-schema';

enum TaskState {
  TODO = 'TODO',
  DONE = 'DONE',
}

const icons: { [K in TaskState]: string } = {
  TODO: '',
  DONE: '✓',
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

  const icon = createTable([
    [
      {
        text: icons[state],
        style: {
          'font-size': '13px',
          'font-weight': '600',
          'text-align': 'center',
          'background-color': state === TaskState.DONE ? B400 : N0,
          'border-radius': '3px',
          'border-style': 'solid',
          'border-width': state === TaskState.DONE ? '0px' : '1px',
          'border-color': N50,
          color: 'white',
          width: '16px',
          height: '16px',
        },
      },
    ],
  ]);

  const iconTd: TableData = {
    text: icon,
    style: {
      'vertical-align': 'top',
      padding: '10px',
      width: '16px',
      height: '16px',
    },
  };

  const textTd: TableData = {
    text,
    style: {
      'font-size': '14px',
      padding: '8px 8px 8px 0',
    },
  };

  const mainContentTable = createTable([[iconTd, textTd]]);

  const mainContentWrapperTable = createTable([[{ text: mainContentTable }]], {
    'background-color': N30,
    'border-radius': '3px',
  });

  return createTable([[{ text: mainContentWrapperTable }]], {
    padding: '4px 8px 4px 0',
  });
}
