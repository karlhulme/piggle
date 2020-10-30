export default {
  input: './src/index.js',
  output: [{
    file: './dist/lib/piggle.js',
    format: 'cjs'
  }, {
    file: './dist/es/piggle.js',
    format: 'es'
  }]
}
