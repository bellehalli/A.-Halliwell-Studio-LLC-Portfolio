/* Read-only asset audit. Never deletes files; cleanup requires an explicit review. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function files(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(root, entry.name)) : [path.join(root, entry.name)]);
}
function load(file) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  require('node:vm').runInNewContext(code, { module, exports: module.exports });
  return module.exports;
}
const assetPattern = /\.(?:png|jpe?g|webp|avif|svg|gif|ico|mp4|webm|woff2?|ttf|pdf|vcf)$/i;
const refs = new Map();
function reference(value, source) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('${')) return;
  const decoded = decodeURIComponent(value.split('?')[0].split('#')[0]);
  if (!assetPattern.test(decoded)) return;
  const key = `public${decoded}`;
  refs.set(key, [...(refs.get(key) || []), source]);
}
for (const file of ['app', 'components', 'data', 'lib'].flatMap(files).filter(file => /\.(tsx?|css)$/.test(file))) {
  const source = fs.readFileSync(file, 'utf8');
  // Quoted paths preserve spaces; JS string literals and CSS url() are both covered.
  for (const match of source.matchAll(/["'`]([^"'`\n]+)["'`]/g)) reference(match[1], file);
}
const { projects } = load('data/projects.ts');
const { caseStudies } = load('data/caseStudies.ts');
function visit(value, source) {
  if (typeof value === 'string') reference(value, source);
  else if (Array.isArray(value)) value.forEach(item => visit(item, source));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => visit(item, source));
}
visit(projects, 'data/projects.ts'); visit(caseStudies, 'data/caseStudies.ts');
for (const [slug, study] of Object.entries(caseStudies)) for (const chapter of study.screenChapters || []) for (const screen of chapter.screens) reference(`/case-studies/${slug}/${screen.file}`, `caseStudies:${slug}`);
reference('/favicon.svg', 'site favicon');
const publicFiles = files('public');
const unused = publicFiles.filter(file => !refs.has(file));
const missing = [...refs.entries()].filter(([file]) => !fs.existsSync(file)).map(([file, sources]) => ({ file, sources }));
const report = { used: refs.size, unused: unused.map(file => ({ file, bytes: fs.statSync(file).size })), missing, unusedBytes: unused.reduce((sum, file) => sum + fs.statSync(file).size, 0) };
if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Assets: ${refs.size} referenced, ${unused.length} unreferenced (${(report.unusedBytes / 1048576).toFixed(1)} MiB).`);
  for (const item of missing) console.error(`Missing asset: ${item.file} (${item.sources.join(', ')})`);
}
if (missing.length) process.exitCode = 1;
