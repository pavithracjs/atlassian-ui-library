ED-7276 Send undo/redo analytics events

Note that this will only work for events which are currently using the approach where we setMeta on a transaction using the analytics plugin key, it will be updated to cover _all_ insert events in ED-7277
