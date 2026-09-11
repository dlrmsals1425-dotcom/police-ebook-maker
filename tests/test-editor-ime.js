const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { root, loadEB } = require("./load-eb");
const EB = loadEB();
vm.runInNewContext(fs.readFileSync(path.join(root, "js/editor.js"), "utf8"), { window: { EB } });
const handlers = {};
const mount = { addEventListener(k, fn) { handlers[k] = fn; }, contains() { return true; } };
const project = { meta: {}, pages: [{ id: "p", type: "cover", title: "", blocks: [{ id: "b", type: "bullets", items: ["", "두 번째"] }] }] };
const changes = [];
EB.Editor.bindMount(mount, project, kind => changes.push(kind));
function field(bind, name) {
  const attrs = { "data-bind": bind, "data-field": name, "data-block-id": "b", "data-index": "0" };
  return {
    innerText: "",
    getAttribute(k) { return attrs[k]; },
    closest(selector) { return selector === "[data-page-id]" ? { getAttribute() { return "p"; } } : this; }
  };
}
for (const name of ["title", "subtitle", "department"]) {
  const el = field("meta", name);
  changes.length = 0;
  handlers.compositionstart({ target: el });
  for (const text of ["ㄱ", "고", "고ㅇ", "고양", "고양경찰서"]) {
    el.innerText = text;
    handlers.input({ target: el, isComposing: true });
  }
  assert.equal(changes.length, 0, "no redraw or partial synchronization during composition");
  handlers.compositionend({ target: el });
  assert.equal(project.meta[name], "고양경찰서");
  assert.deepEqual(changes, ["text"]);
  handlers.input({ target: el, isComposing: false });
  assert.ok(changes.every(k => k === "text"), "final browser input also preserves editor");
}
assert.equal(project.pages[0].title, "고양경찰서");
const heading = field("page", "title");
heading.innerText = "현장 인계";
handlers.input({ target: heading });
assert.equal(project.pages[0].title, "현장 인계");
assert.equal(changes.at(-1), "text");
const item = field("item", "items");
handlers.compositionstart({ target: item });
for (const key of ["Enter", "Backspace"]) {
  handlers.keydown({ target: item, key, preventDefault() { throw Error("IME key intercepted"); } });
}
assert.equal(project.pages[0].blocks[0].items.length, 2);
item.innerText = "한글";
handlers.compositionend({ target: item });
assert.equal(project.pages[0].blocks[0].items[0], "한글");
handlers.keydown({ target: item, key: "Enter", keyCode: 229, preventDefault() { throw Error("legacy IME key intercepted"); } });
handlers.keydown({ target: item, key: "Enter", isComposing: true, preventDefault() { throw Error("composing key intercepted"); } });
handlers.keydown({ target: item, key: "Enter", preventDefault() {} });
assert.equal(project.pages[0].blocks[0].items.length, 3, "ordinary Enter still adds an item");
console.log("Editor IME: Korean composition, cover metadata, page titles, list keys and normal Enter passed");
