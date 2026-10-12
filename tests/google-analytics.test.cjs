const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('lib/google-analytics.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
let consent = 'denied'; const scripts = [];
const context = { exports: {}, window: { location: { origin: 'https://www.ahalliwellstudio.com', pathname: '/start', search: '?email=private@example.com&ref=opaque' } }, localStorage: { getItem: () => consent }, document: { title: 'Start a project', referrer: 'https://example.org/?token=private', cookie: '', createElement: () => ({}), head: { appendChild: script => scripts.push(script) } }, URL, URLSearchParams, Date };
vm.runInNewContext(code, context); const api = context.exports;
api.enableGoogleAnalytics(); api.googleEvent('generate_lead');
assert.equal(scripts.length, 0); assert.equal(context.window.dataLayer, undefined);
consent = 'granted'; api.enableGoogleAnalytics(); api.enableGoogleAnalytics();
assert.equal(scripts.length, 1);
api.googleEvent('generate_lead', { project_type: 'Website' });
const event = Array.from(context.window.dataLayer.at(-1));
assert.equal(event[1], 'generate_lead'); assert.equal(event[2].page_location, 'https://www.ahalliwellstudio.com/start');
assert.ok(!JSON.stringify(context.window.dataLayer).includes('private@example.com'));
assert.ok(!JSON.stringify(context.window.dataLayer).includes('token=private'));
for (const pathname of ['/portal/client', '/fax', '/api/inquiry', '/admin', '/checkout', '/onboarding']) {
  context.window.location.pathname = pathname; const count = context.window.dataLayer.length;
  api.enableGoogleAnalytics(); api.googleEvent('generate_lead'); assert.equal(context.window.dataLayer.length, count);
}
api.disableGoogleAnalytics(); assert.equal(context.window['ga-disable-G-Y7M12CX6VL'], true);
context.window.location.pathname = '/'; consent = 'denied'; const count = context.window.dataLayer.length;
api.googleEvent('page_view'); assert.equal(context.window.dataLayer.length, count);
console.log('PASS consent gating, single script, clean URLs, private-route exclusion, and withdrawal.');
