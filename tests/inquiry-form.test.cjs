const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, mocks, globals = {}) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: name => name in mocks ? mocks[name] : name === "@/lib/studio-config" ? load("lib/studio-config.ts", {}) : require(name), URLSearchParams, crypto: require('node:crypto').webcrypto, ...globals });
  return module.exports;
}
const deniedWindow = { location: { search: '?service=illustration' }, addEventListener() {}, removeEventListener() {} };
for (const key of ['localStorage', 'sessionStorage']) Object.defineProperty(deniedWindow, key, { get() { throw Error('storage denied'); } });
const storage = load('lib/browser-storage.ts', {}, { window: deniedWindow });
assert.equal(storage.readStorage('local', 'draft'), null);
assert.equal(storage.writeStorage('session', 'draft', 'value'), false);
assert.equal(storage.removeStorage('local', 'draft'), false);
const quota = load('lib/browser-storage.ts', {}, { window: { localStorage: { setItem() { throw Error('quota exceeded'); } } } });
assert.equal(quota.writeStorage('local', 'draft', 'value'), false);

// Exercise the real component's effects and handlers without a network or DOM library.
function formHarness(window) {
  const slots = []; let cursor = 0, effects = [], dirty = false, tree, submitted, focus;
  const form = { querySelector(selector) { if (selector === 'input:invalid') return null; return { focus() { focus = selector; } }; } };
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { const next = typeof value === 'function' ? value(slots[i]) : value; if (!Object.is(next, slots[i])) { slots[i] = next; dirty = true; } }]; },
    useRef(initial) { const i = cursor++; return slots[i] ||= { current: initial }; },
    useId() { return 'test-' + cursor++; },
    useMemo(fn) { cursor++; return fn(); },
    useEffect(fn, deps) { const i = cursor++; if (!slots[i] || deps.some((v,j) => !Object.is(v, slots[i][j]))) { slots[i] = deps; effects.push(fn); } },
  };
  const safeStorage = load('lib/browser-storage.ts', {}, { window });
  const Component = load('components/forms/StartProject.tsx', { react, '@/lib/browser-storage': safeStorage, '@vercel/analytics': { track() { throw Error('analytics unavailable'); } } }, {
    window, requestAnimationFrame: fn => fn(), fetch: async (_, options) => { submitted = JSON.parse(options.body); return { status: 200, ok: true, json: async () => ({ success: true, confirmationSent: false }) }; },
  }).default;
  function nodes(node) { if (arguments.length === 0) node = tree; if (!node || typeof node !== 'object') return []; return [node, ...[node.props?.children].flat(Infinity).flatMap(x => nodes(x))]; }
  function render() {
    for (let pass = 0; pass < 15; pass++) {
      dirty = false; cursor = 0; tree = Component({});
      for (const node of nodes()) if (node.type === 'form') node.props.ref.current = form;
      const pending = effects; effects = []; pending.forEach(fn => fn());
      if (!dirty) return tree;
    }
    throw Error('Render failed to settle');
  }
  return { render, nodes, get submitted() { return submitted; }, get focus() { return focus; } };
}
(async () => {
  const labWindow = { location: { search: '?labScope=' + encodeURIComponent(JSON.stringify({ projectType: 'Hospitality / venue', needs: ['Custom interactive feature', 'Illustration / property map'], successGoal: 'Experience Atlas project' })) }, addEventListener() {}, removeEventListener() {} };
  for (const key of ['localStorage', 'sessionStorage']) Object.defineProperty(labWindow, key, { get() { throw Error('storage denied'); } });
  const labForm = formHarness(labWindow); labForm.render();
  assert.equal(labForm.nodes().find(n => n.type === 'button' && n.props.children === 'Hospitality / venue').props['aria-pressed'], true);
  assert.equal(labForm.nodes().find(n => n.type === 'button' && n.props.children === 'Illustration / property map').props['aria-pressed'], true);
  assert(labForm.nodes().some(n => n.type === 'textarea' && n.props.value === 'Experience Atlas project'));
  const h = formHarness(deniedWindow); h.render();
  const illustration = h.nodes().find(n => n.type === 'button' && n.props.children === 'Illustration / property map');
  assert.equal(illustration.props['aria-pressed'], true);
  assert(!h.nodes().some(n => n.type === 'p' && String(n.props.children).includes('draft saves automatically')));
  await h.nodes().find(n => n.type === 'form').props.onSubmit({ preventDefault() {} }); h.render();
  assert.equal(h.submitted, undefined);
  assert(h.focus.includes('projectType'));
  assert(h.nodes().some(n => n.props?.role === 'alert'));
  for (const label of ['Hospitality / venue', "I'm flexible", 'Custom project · priced by scope', 'Upcoming event or season']) {
    h.nodes().find(n => n.type === 'button' && n.props.children === label).props.onClick(); h.render();
  }
  for (const [key, value] of [['name','Test Client'],['email','client@example.com']]) {
    h.nodes().find(n => n.type === 'input' && n.props['data-required'] === key).props.onChange({ target: { value } }); h.render();
  }
  await h.nodes().find(n => n.type === 'form').props.onSubmit({ preventDefault() {} }); h.render();
  assert(h.submitted.needs.includes('Illustration / property map'));
  assert.equal(h.submitted.whyNow, 'Upcoming event or season');
  assert(h.nodes().some(n => n.props?.className === 'start-project start-project-success'));
  const clean = formHarness(deniedWindow); clean.render();
  clean.nodes().find(n => n.type === 'button' && n.props.children === 'Clear my draft').props.onClick(); clean.render();
  assert.equal(clean.nodes().find(n => n.type === 'button' && n.props.children === 'Illustration / property map').props['aria-pressed'], false);
  assert.equal(clean.nodes().find(n => n.type === 'button' && n.props.children === 'Upcoming event or season').props['aria-pressed'], false);
  console.log('PASS denied storage, quota failure, required-answer focus, illustration preselection/submission, clear draft, and saved receipt despite analytics failure.');
})().catch(error => { console.error(error); process.exitCode = 1; });
