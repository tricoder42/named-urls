import typescript from "@rollup/plugin-typescript"

// rollup.config.js
export default {
  input: `src/index.ts`,
  output: [
    {
      file: `dist/index.js`,
      format: "cjs",
    },
    {
      file: `dist/index.es.js`,
      format: "es",
    },
  ],
  external: ["path-to-regexp"],
  plugins: [
    typescript(),
  ],
}
