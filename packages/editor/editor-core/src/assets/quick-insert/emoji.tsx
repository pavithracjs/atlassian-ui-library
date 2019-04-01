import * as React from 'react';

export default function icon() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="M0 24h24V0H0z"/></defs><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><g transform="matrix(1 0 0 -1 8 32)"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><g mask="url(#b)"><path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12" fill="#FFCC4D"/><path d="M12 10c-2.415 0-4.018.281-6 .667-.453.087-1.333 0-1.333-1.334 0-2.666 3.063-6 7.333-6s7.333 3.334 7.333 6c0 1.334-.88 1.422-1.333 1.334-1.982-.386-3.585-.667-6-.667" fill="#664500"/><path d="M6 9.333s2-.666 6-.666 6 .666 6 .666-1.333-2.666-6-2.666-6 2.666-6 2.666" fill="#FFF"/><path d="M9.667 15c0-1.29-.746-2.333-1.667-2.333-.92 0-1.667 1.044-1.667 2.333 0 1.289.746 2.333 1.667 2.333.92 0 1.667-1.044 1.667-2.333M17.667 15c0-1.29-.746-2.333-1.667-2.333-.92 0-1.667 1.044-1.667 2.333 0 1.289.746 2.333 1.667 2.333.92 0 1.667-1.044 1.667-2.333" fill="#664500"/></g></g></g></svg>`,
      }}
    />
  );
}
