const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { test } = require('node:test');
const source = fs.readFileSync('app/api/outreach/open/route.ts', 'utf8');
function harness({ limited = false, fail = false } = {}) {
  const records = [], limits = [];
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports, Buffer, Uint8Array, Response, URL, console: { warn() {} }, require(name) {
    if (name === '@/lib/outreach') return { validOutreachRef: x => /^[a-f0-9]{24}$/.test(x), outreachSteps: ['Day 0','Day 3','Day 7','Day 14'], recordOutreachOpen: async (...args) => { if (fail) throw Error('Storage unavailable'); records.push(args); } };
    if (name === '@/lib/request-rate-limit') return { checkRequestLimit: async (...args) => { limits.push(args); return { limited }; } };
    throw Error(name);
  } });
  return { get: module.exports.GET, records, limits };
}
const url = 'https://www.ahalliwellstudio.com/api/outreach/open?ref=0123456789abcdef01234567&step=Day%200';
test('valid image request records only opaque ref and step, returns uncached GIF', async () => {
  const h = harness(); const r = await h.get(new Request(url, { headers: { 'user-agent': 'Email client' } }));
  assert.deepEqual(h.records[0], ['0123456789abcdef01234567', 'Day 0']); assert.equal(h.limits.length, 1);
  assert.equal(r.headers.get('content-type'), 'image/gif'); assert.match(r.headers.get('cache-control'), /no-store/);
  assert.equal(Buffer.from(await r.arrayBuffer()).subarray(0,6).toString(), 'GIF89a');
});
test('invalid, automatic and rate-limited requests do not become opens', async () => {
  for (const req of [new Request(url.replace('0123456789abcdef01234567','bad')), new Request(url.replace('Day%200','bad')), new Request(url,{headers:{'user-agent':'Link scanner'}}), new Request(url,{headers:{purpose:'prefetch'}})]) {
    const h = harness(); assert.equal((await h.get(req)).status, 200); assert.equal(h.records.length, 0); assert.equal(h.limits.length, 0);
  }
  const h = harness({limited:true}); await h.get(new Request(url)); assert.equal(h.records.length,0);
});
test('tracking storage failure does not break the email image', async () => {
  const h = harness({fail:true}); const r = await h.get(new Request(url)); assert.equal(r.status,200); assert.equal((await r.arrayBuffer()).byteLength,42);
});
