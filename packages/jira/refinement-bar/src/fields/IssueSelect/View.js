// @flow
/** @jsx jsx */

import { jsx } from '@emotion/core';
import { gridSize } from '@atlaskit/theme';

import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16';
import Branch16Icon from '@atlaskit/icon-object/glyph/branch/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Calendar16Icon from '@atlaskit/icon-object/glyph/calendar/16';
import Changes16Icon from '@atlaskit/icon-object/glyph/changes/16';
import Code16Icon from '@atlaskit/icon-object/glyph/code/16';
import Commit16Icon from '@atlaskit/icon-object/glyph/commit/16';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
import Improvement16Icon from '@atlaskit/icon-object/glyph/improvement/16';
import Incident16Icon from '@atlaskit/icon-object/glyph/incident/16';
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import NewFeature16Icon from '@atlaskit/icon-object/glyph/new-feature/16';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Problem16Icon from '@atlaskit/icon-object/glyph/problem/16';
import PullRequest16Icon from '@atlaskit/icon-object/glyph/pull-request/16';
import Question16Icon from '@atlaskit/icon-object/glyph/question/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Subtask16Icon from '@atlaskit/icon-object/glyph/subtask/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';

import Select from '../Select/View';

// do NOT assign directly; a new component must be created to avoid inheritence
const IssueSelectView = (props: *) => <Select {...props} />;

const icons = {
  blog: Blog16Icon,
  branch: Branch16Icon,
  bug: Bug16Icon,
  calendar: Calendar16Icon,
  changes: Changes16Icon,
  code: Code16Icon,
  commit: Commit16Icon,
  epic: Epic16Icon,
  improvement: Improvement16Icon,
  incident: Incident16Icon,
  issue: Issue16Icon,
  'new-feature': NewFeature16Icon,
  page: Page16Icon,
  problem: Problem16Icon,
  'pull-request': PullRequest16Icon,
  question: Question16Icon,
  story: Story16Icon,
  subtask: Subtask16Icon,
  task: Task16Icon,
};

export const formatOptionLabel = (data: Object) => {
  if (!data.type) {
    return data.label;
  }

  const Icon = icons[data.type];

  return (
    <div css={{ alignItems: 'center', display: 'flex' }}>
      <Icon label={`${data.type} icon`} />
      <div css={{ marginLeft: gridSize() }}>{data.label}</div>
    </div>
  );
};

IssueSelectView.defaultProps = {
  formatOptionLabel,
};
IssueSelectView.displayName = 'IssueSelectView';

export default IssueSelectView;
