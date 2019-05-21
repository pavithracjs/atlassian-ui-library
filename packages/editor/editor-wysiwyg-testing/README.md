### WYSIWYG Visual Consistency Testing

Compares VR snapshots of the editor & renderer to validate the WYSIWYG (what you see is what you get) result.

Unlike regular VR tests this package doesn't store visual snapshot images. Instead it stores the percentage values in a JSON file to measure and track the visual consistency (or divergence) between the rendered results of the editor & renderer over time.

If the changes result in improved visual consistency then the updated percentage(s) are written to the JSON file to be used as the new baseline.

Tests will fail if the visual divergence widens.

If tests fail, the composite image, and text figures are written to disk to be reviewed by a developer.

To run:

```
yarn vr:test editor-wysiwyg-testing
```

If the consistency of a content node worsens after up-merging master, you can set the latest values as the new baseline using the `-u` or `--updateSnapshot` flag.

Using the `--debug` flag will also write the composite image to disk to aid in debugging.

> Note: Report updating won't occur during debug builds because their diff won't be pixel perfect against those generated within the Docker container.

If changes result in an improvement you can see them in the generated text file:

```
baseline: 0.0558322192513369
current: 0.03348930481283423
improved: 2.23%
```

If changes result in a regression you can see the figures in the generated text file:

```
baseline: 0.07712418300653595
current: 0.14052287581699346
regressed: 6.34%
```
