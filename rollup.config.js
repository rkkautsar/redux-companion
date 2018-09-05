import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";

const baseConfig = {
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: "node_modules"
      }
    }),
    babel(),
    commonjs(),
    typescript()
  ]
};

const createConfig = (path, output) => ({
  ...baseConfig,
  input: `lib${path}/index.ts`,
  output: [
    {
      file: `dist/${output || path}.js`,
      format: "cjs"
    },
    {
      file: `dist/${output || path}.esm.js`,
      format: "esm"
    }
  ]
});

export default [createConfig("", "index")];
