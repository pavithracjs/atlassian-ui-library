import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { analyticsService } from '../../../analytics';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import { safeInsert } from '../../../utils/insert';

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push(
      // -1, so that it also replaces the container paragraph
      createInputRule(
        /^(\-\-\-|\*\*\*)$/,
        (state, _match, start, end) => {
          analyticsService.trackEvent(
            `atlassian.editor.format.horizontalrule.autoformatting`,
          );
          let tr = state.tr.delete(start, end);
          tr = safeInsert(
            state.schema.nodes.rule.createChecked(),
            start,
            false,
          )(tr);
          return tr;
        },
        true,
      ),
    );

    // '---' and '***' after shift+enter for hr
    rules.push(
      createInputRule(
        new RegExp(`${leafNodeReplacementCharacter}(\\-\\-\\-|\\*\\*\\*)`),
        (state, _match, start, end) => {
          const { hardBreak } = state.schema.nodes;
          if (state.doc.resolve(start).nodeAfter!.type !== hardBreak) {
            return null;
          }
          analyticsService.trackEvent(
            `atlassian.editor.format.horizontalrule.autoformatting`,
          );
          let tr = state.tr.delete(start, end);
          tr = safeInsert(
            state.schema.nodes.rule.createChecked(),
            start,
            false,
          )(tr);
          return tr;
        },
        true,
      ),
    );
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }

  return;
}

export default inputRulePlugin;
