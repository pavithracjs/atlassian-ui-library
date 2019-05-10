- ED-6564: improve typing performance, especially in tables

Be more selective about when to re-render certain nodes. In particular, only re-render table cells when selecting in/out of them, or their contents change. This applies to:

* tables
* images
* emojis
* mentions
* tasks and decisions

Also prevents a number of plugins from notifying about status changes when nothing has changed. In particular:

* breakout
* emoji
* hyperlink
* table