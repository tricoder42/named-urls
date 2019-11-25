import babel from 'rollup-plugin-babel'

// rollup.config.js
export default {
  input: `src/index.js`,
  output: [{
    file: `dist/index.js`,
    format: 'cjs'
  }, {
    file: `dist/index.es.js`,
    format: 'es'
  }],
  external: ["path-to-regexp"],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      externalHelpers: false,
      runtimeHelpers: true
    })
  ],
}
