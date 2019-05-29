- ED-6997: When transitioning between modes (Full Width -> Full Page) while having a selection over React nodes, ProseMirror will try to re-apply the selection during the view update to detached nodes that are no longer rendered.

Now before we apply an update we remove focus from the editor to avoid ProseMirror trying to apply any sort of selection.
