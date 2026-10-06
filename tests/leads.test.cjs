const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');

function load(file, mocks = {}, env = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, require: name => name in mocks ? mocks[name] : name === "@/lib/studio-config" ? load("lib/studio-config.ts", {}) : require(name), Date, Buffer, URL, console, process: { env } }, { filename: file });
  return module.exports;
}
const next = { NextResponse: { json: (body, options = {}) => Response.json(body, options) } };
const fields = load('lib/lead-fields.ts');
const id = '4dba99af-26cf-407b-90e2-b7b7b7c57180';
const payload = { submissionId: id, name: '<Belle>', email: 'test@example.com', business: 'Test', projectType: 'Hospitality / venue', needs: ['Multi-page website'], timing: "I'm flexible", investment: '$5k–$10k', successGoal: 'Clear inquiries' };

async function run() {
  assert.equal(fields.validFollowUpDate('2026-02-30'), false);
  assert.equal(fields.validFollowUpDate('2026-10-01'), true);
  assert.equal(fields.validFollowUpDate(''), true);
  assert.equal(fields.validLeadStage('paid'), false);
  assert.equal(fields.leadInvestmentCents('3750.25'), 375025);
  assert.equal(fields.leadInvestmentCents(''), null);
  assert.throws(() => fields.leadInvestmentCents('-5'));
  assert.equal(fields.nextBusinessFollowUp(new Date('2026-10-02T16:00:00Z')), '2026-10-06');
  assert.equal(fields.nextBusinessFollowUp(new Date('2026-10-03T02:00:00Z')), '2026-10-06');

  const rows = new Map();
  let insertCount = 0;
  const sql = async (strings, ...values) => {
    const query = strings.join('?');
    if (query.includes('INSERT INTO studio_leads')) {
      if (rows.has(values[1])) return [];
      rows.set(values[1], { id: values[0], payload_hash: values[2], confirmation_status: 'pending' });
      insertCount++; return [{ id: values[0] }];
    }
    if (query.includes('SELECT id, payload_hash')) return [rows.get(values[0])];
    return [];
  };
  const leads = load('lib/leads.ts', { 'server-only': {}, '@/lib/portal': { portalDb: () => sql }, '@/lib/lead-fields': fields, 'node:crypto': crypto });
  const first = await leads.saveInquiryLead(id, payload);
  const second = await leads.saveInquiryLead(id, payload);
  assert.equal(first.fresh, true); assert.equal(second.fresh, false); assert.equal(second.id, first.id); assert.equal(insertCount, 1);
  assert.equal((await leads.saveInquiryLead(id, { ...payload, name: 'Changed' })).conflict, true);

  let savedBrief;
  let saves = 0, sent = [], emailFails = false, duplicate = false, limited = false;
  const inquiry = load('app/api/inquiry/route.ts', {
    'next/server': next,
    'resend': { Resend: class { emails = { send: async message => { sent.push(message); if (emailFails) throw Error('provider unavailable'); return { error: null }; } }; } },
    '@/lib/request-rate-limit': { checkRequestLimit: async () => ({ limited, retryAfter: 30 }) },
    '@/lib/leads': { saveInquiryLead: async (_, brief) => { savedBrief = brief; saves++; return { id, fresh: !duplicate, confirmationSent: duplicate, conflict: false }; }, leadEmailStatus: async () => {} },
  }, { RESEND_API_KEY: 'test-only', INQUIRY_TO_EMAIL: 'studio@example.com' });
  const request = data => new Request('https://example.com/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  assert.equal((await inquiry.POST(request({}))).status, 400); assert.equal(saves, 0);
  await inquiry.POST(request({ ...payload, website: 'honeypot' })); assert.equal(saves, 0); assert.equal(sent.length, 0);
  limited = true; assert.equal((await inquiry.POST(request(payload))).status, 429); assert.equal(saves, 0); limited = false;
  let response = await inquiry.POST(request(payload)); assert.equal((await response.json()).confirmationSent, true); assert.equal(saves, 1);
  assert.equal(sent.length, 2); assert(sent[0].html.includes('&lt;Belle&gt;')); assert(!sent[0].html.includes('<Belle>'));
  assert(sent[1].html.includes('https://calendar.app.google/UArjShmAHzt4vGE48')); assert(sent[1].text.includes('1–2 business days'));
  await inquiry.POST(request({ ...payload, whyNow: '<Upcoming launch>' }));
  assert.equal(savedBrief.whyNow, '<Upcoming launch>');
  assert(sent.at(-2).html.includes('&lt;Upcoming launch&gt;'));
  assert(sent.at(-1).text.includes('Why now: <Upcoming launch>'));
  await inquiry.POST(request({ ...payload, labCapability: 'Home Intelligence', successGoal: 'Observation: Water leak\nService path: Plumbing service conversation' }));
  assert.equal(savedBrief.source, 'AHS Lab: Home Intelligence | Not provided');
  assert.match(savedBrief.successGoal, /Plumbing service conversation/);
  assert(sent.at(-2).text.includes('AHS Lab: Home Intelligence'));
  const sentBeforeRetry = sent.length;
  duplicate = true; await inquiry.POST(request(payload)); assert.equal(sent.length, sentBeforeRetry); duplicate = false;
  emailFails = true; response = await inquiry.POST(request(payload)); const receipt = await response.json(); assert.equal(receipt.success, true); assert.equal(receipt.confirmationSent, false);
  emailFails = false;
  response = await inquiry.POST(request({ ...payload, needs: ['Illustration / property map'], investment: 'Custom project · priced by scope' }));
  assert.equal((await response.json()).success, true);
  assert(sent.at(-2).subject.startsWith('[ILLUSTRATION]'));
  assert(sent.at(-1).text.includes('Illustration / property map'));

  let studio = false, writes = 0;
  const manager = load('app/api/portal/studio/leads/route.ts', { 'next/server': next, '@/lib/lead-fields': fields, '@/lib/leads': { ensureLeads: async () => {} }, '@/lib/portal': { portalEnabled: () => true, currentPortalClient: async () => ({ email: 'owner@example.com' }), isPortalStudio: () => studio, portalDb: () => async () => { writes++; return []; } } });
  const managerRequest = (data, origin = 'https://example.com') => new Request('https://example.com/api/portal/studio/leads', { method: 'POST', headers: { origin }, body: JSON.stringify(data) });
  assert.equal((await manager.POST(managerRequest({}))).status, 403); assert.equal(writes, 0);
  studio = true; assert.equal((await manager.POST(managerRequest({}, 'https://evil.example'))).status, 403); assert.equal(writes, 0);
  assert.equal((await manager.POST(managerRequest({ action: 'update', id, ...payload, stage: 'new', followUpOn: '2026-02-30', revision: 1 }))).status, 400); assert.equal(writes, 0);
  assert.equal((await manager.POST(managerRequest({ action: 'update', id, ...payload, stage: 'qualified', followUpOn: '', revision: 1 }))).status, 409); assert.equal(writes, 1);
  console.log('PASS lead validation, dates, retry deduplication, saved receipt on email failure, confirmation link, escaping, rate limiting, manager authorization, CSRF, and stale edits.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
