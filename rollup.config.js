import babel from '@rollup/plugin-babel'

export default {
  input: './src/index.js',
  output: [{
    file: './dist/lib/piggle.js',
    format: 'cjs'
  }, {
    file: './dist/es/piggle.js',
    format: 'es'
  }],
  plugins: [babel({
    babelHelpers: 'bundled',
    extensions: ['.js', '.ts']
  })]
}
