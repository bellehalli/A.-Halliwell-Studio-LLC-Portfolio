const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
function load(file, mocks) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: name => name in mocks ? mocks[name] : require(name), Buffer, process, Date, console });
  return module.exports;
}
const lib = load('lib/consultations.ts', { 'server-only': {}, '@/lib/portal': {}, '@/lib/leads': {} });
const booking = { bookingId: 'calendar:event', name: 'Test Client', email: 'client@example.com', startsAt: '2026-10-05T14:00:00.000Z', endsAt: '2026-10-05T14:30:00.000Z', updatedAt: '2026-09-30T12:00:00.000Z', status: 'confirmed', details: 'Discuss a website' };
assert.equal(lib.validBooking(booking), true);
for (const changes of [{ bookingId: '' }, { email: 'invalid' }, { status: 'other' }, { name: ' ' }, { endsAt: booking.startsAt }, { updatedAt: 'no date' }, { details: 'x'.repeat(5001) }]) assert.equal(lib.validBooking({ ...booking, ...changes }), false);
const raw = JSON.stringify(booking), secret = 'test-only-not-a-production-secret', timestamp = String(Math.floor(Date.now() / 1000));
const sign = body => crypto.createHmac('sha256', secret).update(timestamp + '.' + body).digest('hex');
assert.equal(lib.verifyBookingSignature(raw, timestamp, sign(raw), secret), true);
assert.equal(lib.verifyBookingSignature(raw + ' ', timestamp, sign(raw), secret), false);
assert.equal(lib.verifyBookingSignature(raw, timestamp, sign(raw), 'different'), false);
assert.equal(lib.verifyBookingSignature(raw, timestamp, sign(raw), secret, Date.now() + 301000), false);
assert.equal(lib.verifyBookingSignature(raw, timestamp, 'bad', secret), false);
let writes = 0;
process.env.CONSULTATION_WEBHOOK_SECRET = secret;
process.env.DATABASE_URL = 'test-only';
const route = load('app/api/consultations/webhook/route.ts', { 'next/server': { NextResponse: { json: Response.json } }, '@/lib/consultations': { ...lib, saveConsultation: async () => { writes++; return { changed: true }; } } });
function request(body, signed = true) {
  return new Request('https://example.com/api/consultations/webhook', { method: 'POST', body, headers: { 'content-type': 'application/json', 'x-booking-timestamp': timestamp, 'x-booking-signature': signed ? sign(body) : '' } });
}
(async () => {
  assert.equal((await route.POST(request(raw, false))).status, 401);
  assert.equal((await route.POST(request('invalid json'))).status, 400);
  assert.equal((await route.POST(request(JSON.stringify({ ...booking, email: 'bad' })))).status, 400);
  assert.equal((await route.POST(request('x'.repeat(16001)))).status, 413);
  assert.equal(writes, 0);
  const response = await route.POST(request(raw));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(writes, 1);
  delete process.env.CONSULTATION_WEBHOOK_SECRET;
  assert.equal((await route.POST(request(raw))).status, 503);
  console.log('Consultation validation, signature and webhook tests passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
