- ED-6618: Fixes the exception thrown when trying to apply the delete decoration. 

Occurs on a position where a node was recently deleted. We now re-map the decorations position on state change to verify if it's still valid to draw or simply delete it.
