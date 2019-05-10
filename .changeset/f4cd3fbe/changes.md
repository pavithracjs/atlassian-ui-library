- Fix typeahead re-rendering when moving mouse

Breaking change -> TypeAheadItem:

```ts
export type TypeAheadItemRenderProps = {
  onClick: () => void;

  // BREAKING CHANGE
  // onMouseMove -> onHover
  onHover: () => void;

  isSelected: boolean;
};

export type TypeAheadItem = {
  /*...*/
  render?: (
    props: TypeAheadItemRenderProps,
  ) => React.ReactElement<TypeAheadItemRenderProps> | null;
  /*...*/
};
```

Items returned from `QuickInsertProvider#getItems` method that have custom `render` function will now get `onHover` instead of `onMouseMove`.
