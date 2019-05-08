# @atlaskit/textarea

## 2.0.0
- [major] [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 1.0.0
- [major] [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):

  - This major release indicates that this package is no longer under dev preview but is ready for use

## 0.4.6
- [patch] [0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 0.4.5
- [patch] [cd67ae87f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd67ae87f8):

  - Stop defaultValue from being omitted from props that are spread onto textarea
  - Constraint type of value and defaultValue to string

## 0.4.4
- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/theme@8.1.7

## 0.4.3
- [patch] [3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 0.4.2
- [patch] [cf018d7630](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf018d7630):

  - Allow RefObject to be passed in as ref (i.e. using React.createRef()) and set inner padding to 0

## 0.4.1
- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.0
- [minor] [f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):

  - Fix bug: previous size was size for isCompact, and isCompact did not do anything. Now normal textarea is slightly larger and isCompact makes it the previous size

## 0.3.2
- [patch] [1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.3.1
- [patch] [90a14be594](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90a14be594):

  - Fix broken type-helpers

## 0.3.0
- [minor] [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.2.6
- [patch] [1b952c437d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b952c437d):

  - Change order of props spread to fix textarea focus glow, and smart resizing when onChange passed in

## 0.2.5
- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/theme@8.0.0

## 0.2.4
- [patch] [aab267bb3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aab267bb3a):

  - Added test to make sure the props are passed down to hidden input

## 0.2.3
- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.2.2
- [patch] [9e6b592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e6b592):

  - Added tslib import for textarea

## 0.2.1
- [patch] [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and make theming simpler. Update all dependant components.

## 0.2.0
- [minor] [76a8f1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76a8f1c):

  - Convert @atlaskit/textarea to Typescript
    - Dist paths have changed, if you are importing by exact file path you will need to update your imports `import '@atlaskit/button/dist/es5/components/ButtonGroup'`
    - Flow types are not present any more, Typescript definitions are shipped instead

## 0.1.1
- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.1.0
- [minor] [9d77c4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d77c4e):

  - New textarea package, meant to be a replacement for field-text-area, normalised component architecture, removed dependency on @atlaskit/field-base, updated to use new @atlaskit/theme api
