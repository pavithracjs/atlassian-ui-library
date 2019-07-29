// @noflow

import React from 'react';
import RefinementBar, { IssueSelectFilter } from '../src';

const CONFIG = {
  issueType: {
    label: 'Type',
    type: IssueSelectFilter,
    options: [
      {
        label: 'Issue Types',
        options: [
          { value: 'all-standard', label: 'All standard issue types' },
          { value: 'all-sub-task', label: 'All sub-task issue types' },
        ],
      },
      {
        label: 'Standard Issue Types',
        options: [
          { value: 'bug', type: 'bug', label: 'Bug' },
          { value: 'changes', type: 'changes', label: 'Changes' },
          { value: 'epic', type: 'epic', label: 'Epic' },
          { value: 'improvement', type: 'improvement', label: 'Improvement' },
          { value: 'incident', type: 'incident', label: 'Incident' },
          { value: 'new-feature', type: 'new-feature', label: 'New feature' },
          { value: 'problem', type: 'problem', label: 'Problem' },
          { value: 'question', type: 'question', label: 'Question' },
          { value: 'story', type: 'story', label: 'Story' },
          { value: 'subtask', type: 'subtask', label: 'Subtask' },
          { value: 'task', type: 'task', label: 'Task' },
        ],
      },
    ],
  },
};

export default function IssueSelectFilterConfigReference() {
  const [value, setValue] = React.useState({});

  return (
    <RefinementBar
      fieldConfig={CONFIG}
      irremovableKeys={Object.keys(CONFIG)}
      onChange={v => setValue(v)}
      value={value}
    />
  );
}
