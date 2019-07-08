### Stable API

> Moving to first stable API

Changes from `unstable` release:

- `getUserHasAnsweredMailingList()` is streamlined to just be `() => Promise<boolean>`
- `onSignUp` => `onMailingListAnswer(answer) => Promise<void>`
