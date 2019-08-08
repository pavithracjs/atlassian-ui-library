SL-365: link target for smart link should come from props rather than JSON-LD

This also reduces the possibility of XSS attacks. Implementors should still verify they're not passing invalid URLs to the `smart-card` components.