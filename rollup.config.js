import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

const extensions = ['.js', '.ts']

export default {
  input: './src/index.ts',
  output: [{
    file: './dist/lib/piggle.js',
    format: 'cjs'
  }, {
    file: './dist/es/piggle.js',
    format: 'es'
  }],
  plugins: [
    nodeResolve({
      extensions,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions
    }
  )]
}
