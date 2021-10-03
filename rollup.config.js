import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from "./package.json";
import fs from 'fs';

fs.copyFileSync('wasm/build/web-ifc.wasm', 'dist/web-ifc.wasm');

export default {
  input: 'src/index.ts',
  output: [{
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript(),
  ],
};
