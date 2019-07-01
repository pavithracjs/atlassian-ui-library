export const buildOutlookConditional = (
  ifOutlook: string,
  ifNotOutlook: string,
) =>
  `<!--[if mso]>${ifOutlook}<![endif]--><!--[if !mso]><!-- -->${ifNotOutlook}<!--<![endif]-->`;

export const escapeHtmlString = (content: string | undefined | null) => {
  if (!content) return '';

  // We need to first replace with temp placeholders to avoid recursion, as buildOutlookConditional() returns html, too!
  const escapedContent = content
    .replace(/</g, '$TMP_LT$')
    .replace(/>/g, '$TMP_GT$')
    .replace(/\$TMP_LT\$/g, buildOutlookConditional('≺', '&lt;'))
    .replace(/\$TMP_GT\$/g, buildOutlookConditional('≻', '&gt;'));

  return escapedContent;
};
