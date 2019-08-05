// @noflow

import React from 'react';

import { Heading, PreMap } from './styled';
import {
  AvatarAsyncSelectFilter,
  IssueSelectFilter,
  NumberFilter,
  SelectFilter,
  SearchFilter,
  TextFilter,
  RefinementBarConsumer,
  RefinementBarProvider,
  RefinementBarUI,
} from '../src';

export default class AdvancedConfigExample extends React.Component {
  state = { activePopupKey: null, value: {} };

  onChange = (value: Object, meta: Object) => {
    switch (meta.action) {
      case 'add':
        this.addValue({ [meta.key]: meta.data });
        break;
      case 'remove':
        this.removeValue(meta.key);
        break;
      case 'update':
      case 'clear':
        this.updateValue(value);
        break;
      default:
    }
  };

  addValue = add => {
    this.setState(state => ({ value: { ...state.value, ...add } }));
  };

  removeValue = (remove: string) => {
    this.setState(state => {
      const { value } = state;
      delete value[remove];

      return { value };
    });
  };

  updateValue = value => {
    this.setState({ value });
  };

  render() {
    return (
      <div style={{ padding: 20 }}>
        <RefinementBarProvider
          fieldConfig={FIELD_CONFIG}
          irremovableKeys={['search', 'issueAssignee', 'issueType']}
          onChange={this.onChange}
          value={this.state.value}
        >
          <RefinementBarUI />
          <RefinementBarConsumer>
            {({ value }) => (
              <>
                <Heading>Values</Heading>
                <PreMap value={value} />
              </>
            )}
          </RefinementBarConsumer>
        </RefinementBarProvider>
      </div>
    );
  }
}

// Data
// ------------------------------

const FIELD_CONFIG = (function fieldConfig() {
  const CAPITALS = [
    { label: 'Adelaide', value: 'adelaide' },
    { label: 'Brisbane', value: 'brisbane' },
    { label: 'Canberra', value: 'canberra' },
    { label: 'Darwin', value: 'darwin' },
    { label: 'Hobart', value: 'hobart' },
    { label: 'Melbourne', value: 'melbourne' },
    { label: 'Perth', value: 'perth' },
    { label: 'Sydney', value: 'sydney' },
  ];

  return {
    approvals: {
      label: 'Approvals',
      type: SelectFilter,
      options: CAPITALS,
    },
    browser: {
      label: 'Browser',
      type: TextFilter,
      note: 'The browser(s) in which this issue is reproducible.',
    },
    comment: {
      label: 'Comment',
      type: TextFilter,
    },
    description: {
      label: 'Description',
      type: TextFilter,
      validate: ({ type, value }: *) => {
        const INVALID_FIRST_CHARS = ['*', '?'];
        const defaultReturn = null;

        if (type === 'is_not_set') {
          return defaultReturn;
        }
        if (!value) {
          return 'Please provide some text.';
        }
        if (INVALID_FIRST_CHARS.includes(value.charAt(0))) {
          return "The '*' and '?' are not allowed as first character in a 'wildard' search.";
        }

        return defaultReturn;
      },
    },
    votes: {
      label: 'Votes',
      type: NumberFilter,
    },
    search: {
      label: 'Search',
      type: SearchFilter,
    },
    issueType: {
      type: IssueSelectFilter,
      label: 'Type',
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
    issueAssignee: {
      type: AvatarAsyncSelectFilter,
      label: 'Assignee',
      defaultOptionsLabel: 'Recommended',
      defaultOptions: [
        {
          value: '__current-user',
          label: 'Current User',
          avatar: `http://i.pravatar.cc/48?u=__current-user`,
        },
        {
          value: '__unassigned',
          label: 'Unassigned',
          avatar: null,
        },
      ],
      // NOTE: This may be rate limited in the future. If that happens, import
      // `filterAssignees` from `./data` and use the method beneath
      loadOptions: async inputValue => {
        const response = await fetch(
          'https://api.github.com/repos/facebook/react/contributors',
        ).then(r => r.json());

        return response
          .filter(u => u.login.toLowerCase().includes(inputValue.toLowerCase()))
          .sort((a, b) => b.contributions - a.contributions)
          .map(u => ({
            avatar: u.avatar_url,
            label: u.login,
            value: u.login,
          }));
      },
      // loadOptions: inputValue =>
      //   new Promise(resolve => {
      //     setTimeout(() => {
      //       resolve(filterAssignees(inputValue));
      //     }, 1000);
      //   }),
    },
  };
})();
