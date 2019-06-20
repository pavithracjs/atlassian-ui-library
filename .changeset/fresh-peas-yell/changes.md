Media Picker Browser component migrated to React.

## Main Changes:

* In order to open the native browse window we can either use:  
  1. use `isOpen` prop as any other boolean prop in React
  2. if it's used withing media picker components, examples or tests internally, we can save a `ref` of the `Browser` component, and use `ref.current.browse()` directly.
  3. In contexts where we don't have a React lifecylce (check Editor use cases of `Browser`), we are exposing a new prop named `onBrowseFn` which has the next signature:
    ```
      onBrowseFn?: (browse: () => void) => void;
    ```

    Ideally we will want to use this function in `componentDidMount` and save the provided `browse` function either in state or as a class property. 
    The `browse` function will actually open the native browse functionality.

* In order to cancel an ongoing upload, we can still use same approach as point 2 and 3 from previous use case. Check the type definition on `onCancelFn` for more info.

Apart from those 2 points, this component can be treated the same as `Clipboard` component already shipped in previous major version of MediaPicker.
    
  
    