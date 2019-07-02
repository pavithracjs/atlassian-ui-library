//@flow

module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/syntax-dynamic-import',
  ],
  presets: ['@babel/react', '@babel/flow'],
  overrides: [
    /**
     * REMOVE ME: This override is needed to make sure that we only run the emotion's
     * babel plugin on components that need it. Without it every component will
     * have emotion included in their bundle.
     * Ticket: https://ecosystem.atlassian.net/browse/AK-6065
     */
    {
      test: [
        './packages/core/drawer',
        './packages/core/global-navigation',
        './packages/core/lozenge',
        './packages/core/modal-dialog',
        './packages/core/navigation-next',
        './packages/core/select',
        './packages/core/textfield',
      ],
      presets: ['@emotion/babel-preset-css-prop'],
    },
  ],
  env: {
    'production:cjs': {
      plugins: [
        '@babel/transform-runtime',
        ['styled-components', { minify: false }],
        'transform-dynamic-import',
      ],
      presets: [['@babel/env', { modules: 'commonjs' }]],
      ignore: [
        '**/__mocks__',
        '**/__tests__',
        '**/__fixtures__',
        'node_modules',
      ],
    },
    'production:esm': {
      plugins: [
        '@babel/transform-runtime',
        ['styled-components', { minify: false }],
      ],
      presets: [['@babel/env', { modules: false }]],
      ignore: [
        '**/__mocks__',
        '**/__tests__',
        '**/__fixtures__',
        'node_modules',
      ],
    },
    test: {
      presets: ['@babel/env'],
      // There is no @babel/ scoped transform for this plugin
      plugins: ['transform-dynamic-import', '@babel/transform-runtime'],
    },
  },
};
