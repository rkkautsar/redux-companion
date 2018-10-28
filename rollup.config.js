import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const baseConfig = {
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel(),
    commonjs(),
    terser()
  ]
};

const createConfig = (path, output) => ({
  ...baseConfig,
  input: `lib/${path}.js`,
  output: [
    {
      file: `dist/${output || path}.js`,
      format: 'cjs'
    },
    {
      file: `dist/${output || path}.m.js`,
      format: 'esm'
    }
  ]
});

export default [createConfig('index', 'index'), createConfig('thunk', 'thunk')];
