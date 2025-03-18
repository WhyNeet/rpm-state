import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
       file: 'dist/index.umd.js',
       format: 'umd',
       name: 'Statify',
       sourcemap: true,
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    nodeResolve(),
    commonjs(),
  ],
  external: [],
};