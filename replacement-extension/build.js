/**
 * Build script for Moodle Quiz Solver Chrome Extension
 * Uses esbuild to bundle TypeScript sources into JavaScript content scripts.
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

function copyDir(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, dstPath);
    else fs.copyFileSync(srcPath, dstPath);
  }
}

async function build() {
  const builds = [
    {
      entryPoints: [path.join(__dirname, 'src/content/bridge.ts')],
      outfile: path.join(__dirname, 'content/bridge.js'),
      bundle: true,
      format: 'iife',
      sourcemap: true,
      minify: !isWatch,
      target: 'chrome111',
      logLevel: 'info',
      banner: { js: '// Moodle Quiz Solver - Bridge Content Script\n' },
    },
    {
      entryPoints: [path.join(__dirname, 'src/content/solver.ts')],
      outfile: path.join(__dirname, 'content/solver.js'),
      bundle: true,
      format: 'iife',
      sourcemap: true,
      minify: !isWatch,
      target: 'chrome111',
      logLevel: 'info',
      banner: { js: '// Moodle Quiz Solver - Solver Content Script\n' },
    },
    {
      entryPoints: [path.join(__dirname, 'src/background/background.ts')],
      outfile: path.join(__dirname, 'background/background.js'),
      bundle: true,
      format: 'esm',
      sourcemap: true,
      minify: !isWatch,
      target: 'chrome111',
      logLevel: 'info',
      banner: { js: '// Moodle Quiz Solver - Background Service Worker\n' },
      splitting: false,
    },
    {
      entryPoints: [path.join(__dirname, 'src/popup/popup.ts')],
      outfile: path.join(__dirname, 'popup/popup.js'),
      bundle: true,
      format: 'iife',
      sourcemap: true,
      minify: !isWatch,
      target: 'chrome111',
      logLevel: 'info',
      banner: { js: '// Moodle Quiz Solver - Popup Controller\n' },
      loader: { '.html': 'text' },
    },
  ];

  const staticCopies = [
    { from: 'src/popup/popup.html', to: 'popup/popup.html' },
    { from: 'src/popup/theme.js', to: 'popup/theme.js' },
  ];

  for (const { from, to } of staticCopies) {
    const srcPath = path.join(__dirname, from);
    const dstPath = path.join(__dirname, to);
    if (fs.existsSync(srcPath)) {
      fs.mkdirSync(path.dirname(dstPath), { recursive: true });
      fs.copyFileSync(srcPath, dstPath);
      console.log(`Copied: ${to}`);
    }
  }

  const vendorSrc = path.join(__dirname, 'vendor');
  if (!fs.existsSync(vendorSrc)) {
    const origVendor = path.join(__dirname, '..', 'reverse-engineered-extension', 'quiz-solver-moodle-v3.0.2', 'vendor');
    if (fs.existsSync(origVendor)) {
      fs.mkdirSync(vendorSrc, { recursive: true });
      copyDir(origVendor, vendorSrc);
      console.log('Copied: vendor/ (from original extension)');
    }
  }

  const assetsDir = path.join(__dirname, 'assets');
  if (fs.existsSync(assetsDir)) {
    console.log('Assets already present');
  } else {
    const origAssets = path.join(__dirname, '..', 'reverse-engineered-extension', 'quiz-solver-moodle-v3.0.2', 'assets');
    if (fs.existsSync(origAssets)) {
      fs.mkdirSync(assetsDir, { recursive: true });
      copyDir(origAssets, assetsDir);
      console.log('Copied: assets/ (from original extension)');
    }
  }

  if (isWatch) {
    const ctx = await esbuild.context({
      ...builds[0],
      watch: true,
    });
    console.log('Watching for changes...');
  } else {
    for (const buildConfig of builds) {
      const { watch, ...config } = buildConfig;
      void watch;
      await esbuild.build(config);
    }
    console.log('\nBuild complete!');
    console.log('Output:');
    console.log('  content/bridge.js');
    console.log('  content/solver.js');
    console.log('  background/background.js');
    console.log('  popup/popup.js');
    console.log('  popup/popup.html');
    console.log('  popup/theme.js');
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
