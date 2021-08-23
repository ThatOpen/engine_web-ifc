import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from "./package.json";

export default {
  input: 'src/index.ts',
  output: [{
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    }
  ],
  external: ['web-ifc', 'three-mesh-bvh', 'three', 'three/examples/jsm/utils/BufferGeometryUtils'],
  plugins: [
    resolve(),
    typescript()
  ],
};
