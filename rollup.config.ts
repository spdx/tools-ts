import { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'

const bundle: RollupOptions = {
  input: 'lib/index.ts',
  plugins: [typescript({ sourceMap: true })],
  output: {
    file: './build/bundle.js',
    format: 'es',
    sourcemap: true
  }
}

export default bundle
