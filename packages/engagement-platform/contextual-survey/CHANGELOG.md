# @atlaskit/contextual-survey

## 1.0.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 1.0.1

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 1.0.0

### Major Changes

- [major][271b7db35b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271b7db35b):

  _💥 Most of the changes listed are breaking changes from the 0.x release_

  ### New component for placement: `<SurveyMarshal />`

  We no longer require consumers to know anything about `react-transition-group` to use this package. The `<SurveyMarshal />` takes care of the placement and mounting / unmounting animation of the component. It accepts a _function as a child_ which needs to return the `<ContextualSurvey />`. This pattern also allows the `<ContextualSurvey />` to not be evaluated when it is not mounted

  ```js
  import { SurveyMarshal, ContextualSurvey } from '@atlaskit/contextual-survey';

  <SurveyMarshal shouldShow={showSurvey}>
    {() => <ContextualSurvey />}
  </SurveyMarshal>;
  ```

  ### Other

  - `getUserHasAnsweredMailingList: () => boolean | () => Promise<boolean>` has been streamlined to just be `() => Promise<boolean>`.
  - ~~`onSignUp() => Promise<void>`~~ has become `onMailingListAnswer(answer) => Promise<void>`. Previously `onSignUp` was only called if the user selected they wanted to sign up. `onMailingListAnswer` will be called when the user selects they want to sign up, as well as if they select that they do not want to sign up.
  - 💄 `<ContextualSurvey />` now animates in as well as out
  - 💄 No more scrollbars during closing animation
  - 💄 Fixing spacing for `FeedbackAcknowledgement` screen
  - 💄 Audit dismiss button alignment
  - 🛠Preventing double calls to `onDismiss()`
  - 🛠`onDismiss()` now provided with a `enum:DismissTrigger` to give more information about the reason for the dismiss
  - 🛠If `<ContextualSurvey />` is dismissed while `onSubmit` is resolving, then `getUserHasAnsweredMailingList()` is not called. We do this as we won't be showing the email sign up
  - 🛠If the user marks that they do not want to be contacted, then `getUserHasAnsweredMailingList()` is not called. Previously `getUserHasAnsweredMailingList()` was always called _regardless_ of whether the user wanted to be contacted. The email sign up is only showed if the user states that they want to be contacted and if `getUserHasAnsweredMailingList` returns `false`. We now don't call `getUserHasAnsweredMailingList` if the user has stated they don't want to be contacted as it is a precondition.
  - 🚀 The user is able to dismiss the form at any time using the `escape` key
  - 🕵️‍ After clicking a score the response `textarea` is given browser focus.
  - ✅ New behaviour for the _can contact_ checkbox. It is now not selected by default. When a user types into the response text area for the first time we swap it to checked. From that point the user is welcome to change it's value and we do not automatically swap it to checked again. This allows people to select a score but not be contacted for it. It also recognises that the engagement platform would like to be able to respond to people who provide feedback.
  - ♿️ Added `aria-pressed` to currently selected score
  - 📖 Documentation explaining application flow
  - 👩‍🔬 Added automated test for happy path
  - ❌ No longer exporting `surveyWidth` and `surveyMargin`. All placement is handled by `<SurveyMarshal />`

## 0.1.3

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/form@6.1.2
  - @atlaskit/checkbox@9.0.0

## 0.1.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/form@6.1.1
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 0.1.1

### Patch Changes

- [patch][0fc1ac28e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0fc1ac28e8):

  Fixed missing background colour.

## 0.1.0

### Minor Changes

- [minor][25f45f87f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25f45f87f4):

  Create contextual survey component
