const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { test } = require('node:test');

const source = fs.readFileSync('app/api/outreach/click/route.ts', 'utf8');
const targets = {
  portfolio: 'https://www.ahalliwellstudio.com/',
  start: 'https://www.ahalliwellstudio.com/start',
  elan: 'https://elan.ahalliwellstudio.com/book.html',
  routing: 'https://www.ahalliwellstudio.com/lab?capability=routing-engine#capabilities',
};

function harness({ limited = false, fail = false } = {}) {
  const records = [], limits = [];
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, {
    module, exports: module.exports, Response, URL, console: { warn() {} },
    require(name) {
      if (name === '@/lib/outreach') return {
        outreachDestinations: targets,
        outreachSteps: ['Day 0', 'Day 3', 'Day 7', 'Day 14'],
        validOutreachDestination: value => Object.hasOwn(targets, value),
        validOutreachRef: value => /^[a-f0-9]{24}$/.test(value),
        recordOutreachClick: async (...args) => { if (fail) throw Error('Storage unavailable'); records.push(args); },
      };
      if (name === '@/lib/request-rate-limit') return {
        checkRequestLimit: async (...args) => { limits.push(args); return { limited }; },
      };
      throw Error(name);
    },
  });
  return { get: module.exports.GET, records, limits };
}

const base = 'https://www.ahalliwellstudio.com/api/outreach/click?ref=0123456789abcdef01234567&step=Day%200&to=start';

test('valid click records opaque reference, step, and allowlisted destination then redirects without referrer', async () => {
  const h = harness();
  const response = await h.get(new Request(base, { headers: { 'user-agent': 'Email client' } }));
  assert.deepEqual(h.records[0], ['0123456789abcdef01234567', 'Day 0', 'start']);
  assert.equal(h.limits.length, 1);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), targets.start);
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.match(response.headers.get('cache-control'), /no-store/);
});

test('invalid and automated requests are not logged and never become open redirects', async () => {
  const requests = [
    [base.replace('0123456789abcdef01234567', 'bad'), targets.start],
    [base.replace('Day%200', 'bad'), targets.start],
    [base.replace('to=start', 'to=https://example.com'), targets.portfolio],
    [new Request(base, { headers: { 'user-agent': 'Link scanner' } }), targets.start],
    [new Request(base, { headers: { purpose: 'prefetch' } }), targets.start],
  ];
  for (const [input, expectedTarget] of requests) {
    const h = harness();
    const response = await h.get(input instanceof Request ? input : new Request(input));
    assert.equal(h.records.length, 0);
    assert.equal(response.headers.get('location'), expectedTarget);
  }
  const h = harness({ limited: true });
  await h.get(new Request(base));
  assert.equal(h.records.length, 0);
});

test('tracking storage failure does not block the portfolio redirect', async () => {
  const h = harness({ fail: true });
  const response = await h.get(new Request(base));
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), targets.start);
});
