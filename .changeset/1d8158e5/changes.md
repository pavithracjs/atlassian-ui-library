- **Breaking:** this version is a major overhaul of the package. Check out the upgrade
  guide in the Atlaskit website for more information.
  - **New API:** The exposed named exports are now InlineEdit and InlineEditableTextfield.
  These components are built to be standalone, not used within a Form, but updating data
  individually. The props API for each of these components is similar in some ways, but
  simplified and clarified.
    - InlineEdit is a controlled component which receives a read view and an edit view as
    props, and facilitates the changing of editing state. It is designed to be simple but
    flexible.
    - InlineEditableTextfield is a component which abstracts away most of the complexity
    of the InlineEdit component and simply switches between a single line of text and a
    textfield.
  - **Underlying technical improvements:**
    - This new version supports the use of Textfield and Textarea components (as an
    improvement over the soon-to-be deprecated Field-text and Field-text-area components).
    - This new version includes validation with an inline dialog which is not loaded if a
    validate function is not provided, improving performance.
- **Typescript:** Inline Edit is now written in Typescript. The props are exported as
Typescript types. This also means we are dropping support for Flow in this component.