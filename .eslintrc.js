module.exports = {
  plugins: ['react', 'jsdoc'],
  parser: 'babel-eslint',
  parserOptions: {
     sourceType: 'module',
     allowImportExportEverywhere: true,
     ecmaVersion: 6,
     ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true
     }
  },
  env: {
     browser: true,
     node: true,
     es6: true
  },
  rules: {
    
  }
};
