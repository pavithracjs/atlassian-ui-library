import { applyMarks, escapeHtmlString } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export default function text({ marks, text }: NodeSerializerOpts) {
  const escapedText = escapeHtmlString(text!);
  return applyMarks(marks, escapedText);
}
