import { NodeSerializerOpts } from '../interfaces';
import { TableData, createTable, createTag, serializeStyle } from '../util';
import { N30 } from '@atlaskit/adf-schema';
import { createContentId } from '../static';

enum TaskState {
  TODO = 'TODO',
  DONE = 'DONE',
}

const icons: { [K in TaskState]: string } = {
  TODO: createTag('img', {
    style: serializeStyle({
      width: '16px',
      height: '16px',
    }),
    src: createContentId('taskItemUnchecked', 'icon'),
  }),
  DONE: createTag('img', {
    style: serializeStyle({
      width: '16px',
      height: '16px',
    }),
    src: createContentId('taskItemChecked', 'icon'),
  }),
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
