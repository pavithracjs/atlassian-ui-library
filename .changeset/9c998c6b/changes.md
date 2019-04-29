- ED-6737: Prevent default tables from going into overflow in the renderer straight away after publish.

This issue was caused by dynamic sizing, a default table being created in 760 width and then being rendered in 680 width.

Also included in this patch: Preventing the shadow appearing on the right hand side of the table, when there is no overflow.
