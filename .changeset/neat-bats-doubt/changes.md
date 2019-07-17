ED-7116 Update logic for image sizing when changing layout to/from aligned

- If an image is smaller than 50% of line length the image will preserve its original size when aligned, else it will be capped at 50% line length
- When returning to a centred image after aligning the image will use its most recent resized size (whether that happened when aligned or when it was previously centred) or, if never resized, fall back to its original size
