ED-7276 Send undo analytics events (part 1)

Add new plugin HistoryAnalytics that keeps history alongside prosemirror-history's but saves the transactions with their analytics meta

On user hitting Cmd-z/Ctrl-z we will fire a corresponding undo event if we detect a analytics meta in the transaction that was undone
