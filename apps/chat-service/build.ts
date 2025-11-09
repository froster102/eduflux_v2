import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  platform: 'node',
  target: ['node24'],
  outfile: './build/server.js',
  nodePaths: ['../../node_modules', './node_modules'],
});
