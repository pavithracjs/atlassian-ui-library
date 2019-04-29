### WYSIWYG Visual Consistency Testing

Compares VR snapshots of the editor & renderer to validate the WYSIWYG (what you see is what you get) result.

Unlike regular VR tests this package doesn't store visual snapshot images. Instead it stores the percentage values in a JSON file to measure and track the visual consistency (or divergence) between the rendered results of the editor & renderer over time.

If the changes result in improved visual consistency then the updated percentage(s) are written to the JSON file to be used as the new baseline.

Tests will fail if the visual divergence widens.

If tests fail, the composite image is written to disk to be reviewed by a developer.

If the consistency of a content node worsens after up-merging master, you can set the latest values as the new baseline using the `-u` or `--updateSnapshot` flag.

Using the `--debug` flag will also write the composite image and values to disk to aid in debugging.
