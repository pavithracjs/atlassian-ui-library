import * as React from 'react';

export default function icon() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M27.284 12c-1.888 0-3.422 1.577-3.422 3.522 0 1.944 1.534 3.521 3.422 3.521 3.245 0 1.365 6.118-2.727 6.755a.818.818 0 0 0-.695.806c0 .5.447.896.942.82C32.242 26.296 34.886 12 27.284 12m-9.86 0C15.533 12 14 13.577 14 15.522c0 1.944 1.533 3.521 3.424 3.521 3.243 0 1.363 6.118-2.73 6.755a.818.818 0 0 0-.694.806c0 .5.447.896.941.82C22.381 26.296 25.026 12 17.424 12" id="a"/></defs><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><rect fill="#C1C7D0" x="6" y="8" width="2" height="24" rx="1"/><use fill="#6C798F" xlink:href="#a"/></g></svg>`,
      }}
    />
  );
}
