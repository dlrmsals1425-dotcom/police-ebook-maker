/* Run the real app entry with rendering stubs to exercise failed and successful saves. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { root, loadEB } = require("./load-eb");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const ids = {};
for (const m of html.matchAll(/\bid="([^"]+)"/g)) {
  assert.ok(!ids[m[1]], "unique HTML ID: " + m[1]);
  const classes = new Set();
  ids[m[1]] = {
    dataset: {}, events: {},
    classList: {
      add: c => classes.add(c), remove: (...cs) => cs.forEach(c => classes.delete(c)),
      contains: c => classes.has(c),
      toggle(c, on) { on ? classes.add(c) : classes.delete(c); }
    },
    addEventListener(k, fn) { this.events[k] = fn; },
    appendChild() {}, contains() { return false; }, setAttribute() {},
    removeAttribute(name) { delete this[name]; },
    focus() { this.focused = true; }
  };
}
const events = {};
const doc = {
  body: { dataset: {}, classList: ids.app.classList }, readyState: "loading",
  getElementById: id => ids[id],
  querySelector: sel => sel.startsWith("#") ? ids[sel.slice(1)] : null,
  querySelectorAll: () => [],
  addEventListener(k, fn) { (events[k] ||= []).push(fn); }
};
let ok = false, change, pageRenders = 0, savedProject;
const EB = loadEB();
EB.$ = doc.querySelector;
EB.$$ = () => [];
EB.debounce = fn => fn;
EB.toast = () => {};
EB.Store = { load: () => null, save(project) { savedProject = project; return ok; }, markSeen() {} };
EB.Render = { pageHtml: EB.Render.pageHtml, nav() {}, page() { pageRenders++; }, fit() {} };
EB.Editor = {
  pageById: (p, id) => p.pages.find(x => x.id === id),
  findPageIndex: (p, id) => p.pages.findIndex(x => x.id === id),
  bindMount(m, p, fn) { change = fn; }, inspectorHtml: () => ""
};
const context = {
  window: { EB, addEventListener() {} }, document: doc,
  requestAnimationFrame() {}, URLSearchParams, location: { search: "" }
};
vm.runInNewContext(fs.readFileSync(path.join(root, "js/app.js"), "utf8"), context);
events.DOMContentLoaded[0]();
const status = ids["save-status"];
assert.match(status.textContent, /저장 실패/);
assert.equal(status.classList.contains("is-saved"), false, "boot must not claim failed save succeeded");
assert.equal(status.classList.contains("is-error"), true);
ok = true;
const beforeTextEdit = pageRenders;
change("text");
assert.equal(pageRenders, beforeTextEdit, "text edits must preserve the mounted editor and caret");
assert.match(status.textContent, /자동 저장/);
assert.equal(status.classList.contains("is-error"), false);
ok = false;
let prevented = false;
for (const fn of events.keydown) fn({ key: "s", ctrlKey: true, target: { closest: () => ({}) }, preventDefault() { prevented = true; } });
assert.equal(prevented, true, "Ctrl+S handled while editing input");
assert.match(status.textContent, /저장 실패/);
ok = true;
doc.visibilityState = "hidden";
events.visibilitychange[0]();
assert.match(status.textContent, /자동 저장/);
assert.equal(ids["btn-prev"].disabled, true);
// The index.html preview must execute the exported reader, not the editor's static page.
ids['btn-next'].events.click();
assert.equal(ids['page-indicator'].textContent, '2 / ' + savedProject.pages.length);
savedProject.meta.title = '수정한 제목으로 미리보기';
ids['btn-preview'].events.click();
assert.equal(doc.body.classList.contains('is-preview'), true);
assert.equal(ids['reader-preview'].hidden, false);
assert.ok(ids['reader-frame'].srcdoc.includes('<title>수정한 제목으로 미리보기</title>'));
assert.ok(ids['reader-frame'].srcdoc.includes('function startTurn(dir)'), 'preview includes real 3D turn runtime');
assert.ok(ids['reader-frame'].srcdoc.includes('var preview=true;'), 'app explicitly enables animation preview');
assert.ok(ids['reader-frame'].srcdoc.includes('class="ebook motion-enabled"'), 'preview CSS permits animation with reduced-motion settings');
assert.ok(ids['reader-frame'].srcdoc.includes('var initial=1;'), 'preview starts at the edited page');
assert.ok(ids['reader-frame'].srcdoc.includes('id="reader-next"'), 'preview has working reader navigation');
assert.equal(ids['reader-frame'].focused, true);
const beforePreviewKey = pageRenders;
for (const fn of events.keydown) fn({key: 'ArrowRight', target: {closest: () => null}});
assert.equal(pageRenders, beforePreviewKey, 'parent shortcuts cannot move the hidden editor');
ids['btn-preview-exit'].events.click();
assert.equal(doc.body.classList.contains('is-preview'), false);
assert.equal(ids['reader-preview'].hidden, true);
assert.equal(ids['reader-frame'].srcdoc, undefined, 'closing discards the preview document');
assert.equal(ids['page-indicator'].textContent, '2 / ' + savedProject.pages.length);
assert.equal(ids['btn-preview'].focused, true);
savedProject.meta.title = '다시 수정한 제목';
ids['btn-preview'].events.click();
assert.ok(ids['reader-frame'].srcdoc.includes('<title>다시 수정한 제목</title>'), 'reopening rebuilds current content');
ids['btn-preview-exit'].events.click();
console.log("App: save recovery, editor caret, mobile reader preview, initial page, refreshed content and return to editing passed");
