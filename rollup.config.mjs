import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' with { type: 'json' };

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfig: './tsconfig.json'
      })
    ]
  },
  // Separate bundles for individual modules
  {
    input: 'src/result/index.ts',
    output: [
      {
        file: 'dist/result.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/result.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfig: './tsconfig.json'
      })
    ]
  },
  {
    input: 'src/option/index.ts',
    output: [
      {
        file: 'dist/option.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/option.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfig: './tsconfig.json'
      })
    ]
  }
];