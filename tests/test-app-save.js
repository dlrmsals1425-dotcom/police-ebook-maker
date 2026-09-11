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
    appendChild() {}, contains() { return false; }, setAttribute() {}
  };
}
const events = {};
const doc = {
  body: { dataset: {} }, readyState: "loading",
  getElementById: id => ids[id],
  querySelector: sel => sel.startsWith("#") ? ids[sel.slice(1)] : null,
  querySelectorAll: () => [],
  addEventListener(k, fn) { (events[k] ||= []).push(fn); }
};
let ok = false, change, pageRenders = 0;
const EB = loadEB();
EB.$ = doc.querySelector;
EB.$$ = () => [];
EB.debounce = fn => fn;
EB.toast = () => {};
EB.Store = { load: () => null, save: () => ok, markSeen() {} };
EB.Render = { nav() {}, page() { pageRenders++; }, fit() {} };
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
console.log("App save: boot failure, retry, input shortcut, background flush and unique IDs passed");
