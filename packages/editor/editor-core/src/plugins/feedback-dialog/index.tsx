import React from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin, FeedbackInfo } from '../../types';
import { IconFeedback } from '../quick-insert/assets';
import { version as coreVersion } from '../../version.json';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';

import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../analytics';
import loadJiraCollectorDialogScript from './loadJiraCollectorDialogScript';

export const pluginKey = new PluginKey('feedbackDialogPlugin');

let showJiraCollectorDialog: () => void;
let feedbackInfoHash: string;
let defaultFeedbackInfo: FeedbackInfo;

const hashFeedbackInfo = (feedbackInfo: FeedbackInfo): string => {
  const { product, packageName, packageVersion, labels } = feedbackInfo;
  return [product, packageName, packageVersion, ...(labels || [])].join('|');
};

export const openFeedbackDialog = async (feedbackInfo?: FeedbackInfo) =>
  new Promise(async (resolve, reject) => {
    const combinedFeedbackInfo = {
      ...defaultFeedbackInfo,
      ...feedbackInfo,
    };
    const newFeedbackInfoHash = hashFeedbackInfo(combinedFeedbackInfo);
    if (!showJiraCollectorDialog || feedbackInfoHash !== newFeedbackInfoHash) {
      try {
        showJiraCollectorDialog = await loadJiraCollectorDialogScript(
          [
            combinedFeedbackInfo.product || 'n/a',
            ...(combinedFeedbackInfo.labels || []),
          ],
          combinedFeedbackInfo.packageName || '',
          coreVersion,
          combinedFeedbackInfo.packageVersion || '',
        );

        feedbackInfoHash = newFeedbackInfoHash;
      } catch (err) {
        reject(err);
      }
    }

    window.setTimeout(showJiraCollectorDialog, 0);
    resolve();
  });

const feedbackDialog = (feedbackInfo: FeedbackInfo): EditorPlugin => {
  defaultFeedbackInfo = feedbackInfo;
  return {
    pluginsOptions: {
      quickInsert: ({ formatMessage }) => [
        {
          title: formatMessage(messages.feedbackDialog),
          description: formatMessage(messages.feedbackDialogDescription),
          priority: 400,
          keywords: ['feedback', 'bug'],
          icon: () => (
            <IconFeedback label={formatMessage(messages.feedbackDialog)} />
          ),
          action(insert, _state) {
            const tr = insert('');
            openFeedbackDialog(feedbackInfo);

            return addAnalytics(tr, {
              action: ACTION.OPENED,
              actionSubject: ACTION_SUBJECT.FEEDBACK_DIALOG,
              actionSubjectId: ACTION_SUBJECT_ID.SHORTCUT_FEEDBACK_DIALOG,
              attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
              eventType: EVENT_TYPE.UI,
            });
          },
        },
      ],
    },
  };
};

export default feedbackDialog;
