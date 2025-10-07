/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  reportNeedlessDisables: true,
  reportInvalidScopeDisables: true,
  reportDescriptionlessDisables: true,
  rules: {
    'font-family-no-missing-generic-family-keyword': [
      true,
      {
        ignoreFontFamilies: ['Font Awesome 5 Free'],
      },
    ],
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    // Fixable Stylelint 16 rules
    'declaration-block-no-redundant-longhand-properties': null,
    'media-feature-range-notation': null,
  },
  ignoreFiles: ['node_modules/', 'common/**/*.css', '**/bootstrap*.css'],
};
