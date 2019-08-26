import React from 'react';

import {
  createEditorFactory,
  doc,
  p,
  insertText,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorView } from 'prosemirror-view';
import ToolbarFeedback from '../../../../ui/ToolbarFeedback';

import * as LoadJiraCollectorDialogScript from '../../../../plugins/feedback-dialog/loadJiraCollectorDialogScript';
import { openFeedbackDialog } from '../../../../plugins/feedback-dialog';

describe('feedbackDialogPlugin', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const loadJiraCollectorDialogScript = jest.spyOn(
    LoadJiraCollectorDialogScript,
    'default',
  );
  loadJiraCollectorDialogScript.mockImplementation(() => () => () => {});

  const editor = (doc: any, _trackEvent?: () => {}) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));

    return createEditor({
      doc,
      editorProps: {
        appearance: 'full-page',
        allowAnalyticsGASV3: true,
        feedbackInfo: {
          product: 'bitbucket',
          packageVersion: '666.6.6',
          packageName: 'editor',
          labels: ['atlaskit-comment-bitbucket'],
        },
        primaryToolbarComponents: [
          <ToolbarFeedback
            product={'bitbucket'}
            key="toolbar-feedback"
            packageVersion="999.9.9"
          />,
        ],
      },
      createAnalyticsEvent,
    });
  };

  describe('Quick insert', () => {
    afterAll(() => {
      delete window.jQuery;
    });

    beforeAll(() => {
      window.jQuery = { ajax: () => {} };
    });

    beforeEach(() => {
      ({ editorView, sel } = editor(doc(p('{<>}'))));

      loadJiraCollectorDialogScript.mockClear();
      insertText(editorView, '/bug', sel);
      sendKeyToPm(editorView, 'Enter');
    });

    let editorView: EditorView;
    let sel: number;

    it('should call "loadJiraCollectorDialogScript" with correct params', () => {
      expect(loadJiraCollectorDialogScript).toHaveBeenCalledWith(
        ['bitbucket', 'atlaskit-comment-bitbucket'],
        'editor',
        '999.9.9',
        '666.6.6',
      );
    });

    it('should fire Analytics GAS V3 events', () => {
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'opened',
        actionSubject: 'feedbackDialog',
        eventType: 'ui',
        attributes: {
          inputMethod: 'quickInsert',
        },
      });
    });
  });

  describe('openFeedbackDialog', () => {
    const param1 = {
      product: 'jira',
      labels: ['label1'],
      packageName: 'package1',
      packageVersion: '111.222.333',
    };
    const param2 = {
      product: 'bitbucket',
      labels: ['label2'],
      packageName: 'package2',
      packageVersion: '444.555.666',
    };

    describe('called multiple times with same params', () => {
      beforeEach(async () => {
        loadJiraCollectorDialogScript.mockClear();
        await openFeedbackDialog(param1);
        await openFeedbackDialog(param1);
      });

      it('should call "loadJiraCollectorDialogScript" with correct times and params', () => {
        expect(loadJiraCollectorDialogScript).toBeCalledTimes(1);
        expect(loadJiraCollectorDialogScript).toHaveBeenCalledWith(
          ['jira', 'label1'],
          'package1',
          '999.9.9',
          '111.222.333',
        );
      });

      describe('called multiple times with different params', () => {
        beforeEach(async () => {
          loadJiraCollectorDialogScript.mockClear();
          await openFeedbackDialog(param2);
          await openFeedbackDialog(param1);
        });

        it('should call "loadJiraCollectorDialogScript" with correct times and params', () => {
          expect(loadJiraCollectorDialogScript).toBeCalledTimes(2);
          expect(loadJiraCollectorDialogScript).toHaveBeenCalledWith(
            ['jira', 'label1'],
            'package1',
            '999.9.9',
            '111.222.333',
          );
          expect(loadJiraCollectorDialogScript).toHaveBeenCalledWith(
            ['bitbucket', 'label2'],
            'package2',
            '999.9.9',
            '444.555.666',
          );
        });
      });
    });
  });
});
