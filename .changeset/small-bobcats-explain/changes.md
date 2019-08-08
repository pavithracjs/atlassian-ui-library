ED-7175: unify smart link and hyperlink toolbars

Also updates the toDOM and parseDOM on ADF nodes, making `url` optional.

Smart cards can now optionally be passed an onResolve callback, of the shape:

    onResolve?: (data: { url?: string; title?: string }) => void;

This gets fired when the view resolves a smart card from JSON-LD, either via the client or the `data` prop.