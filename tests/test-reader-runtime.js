/* Generated reader navigation runs in a minimal DOM; this is not a layout test. */
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { loadEB } = require("./load-eb");
const EB = loadEB();

function element() {
  const classes = new Set();
  return {
    style: {}, attributes: {}, events: {}, offsetWidth: 794, offsetHeight: 1123,
    clientWidth: 1200, clientHeight: 900,
    classList: {
      contains: c => classes.has(c),
      add: c => classes.add(c), remove: c => classes.delete(c),
      toggle(c, on) { on = on === undefined ? !classes.has(c) : on; on ? classes.add(c) : classes.delete(c); return on; }
    },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    addEventListener(k, fn) { this.events[k] = fn; },
    focus() { this.focused = true; },
    closest() { return null; }
  };
}

const project = EB.buildSampleProject();
const html = EB.Export.htmlString(project);
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ids = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m => [m[1], element()]));
const pages = project.pages.map(element);
const links = project.pages.map(element);
const body = element();
const events = {};
const doc = {
  body,
  getElementById: id => ids[id],
  querySelectorAll: () => pages,
  querySelector: selector => {
    if (selector === ".toc a.is-on") return links.find(a => a.classList.contains("is-on"));
    const match = selector.match(/data-i="(\d+)"/);
    return match ? links[+match[1]] : null;
  },
  addEventListener: (key, fn) => { events[key] = fn; }
};
const context = {
  document: doc, location: { hash: "#p2" }, history: { replaceState() {} },
  localStorage: { getItem() { return "0"; }, setItem() {}, removeItem() {} },
  window: { matchMedia() { return { matches: false }; }, addEventListener() {} }
};
vm.runInNewContext(script, context);
assert.equal(ids.pg.textContent, "2 / " + pages.length);
assert.equal(pages.filter(p => p.classList.contains("is-open")).length, 1);
ids["reader-prev"].onclick();
assert.equal(ids["reader-prev"].disabled, true);
ids["reader-next"].onclick();
assert.equal(ids["reader-prev"].disabled, false);
ids.tocbtn.onclick();
assert.equal(body.classList.contains("toc-open"), true);
assert.equal(ids.tocbtn.attributes["aria-expanded"], "true");
assert.equal(ids["toc-close"].focused, true);
events.keydown({ key: "ArrowRight", target: element(), preventDefault() {} });
assert.equal(ids.pg.textContent, "2 / " + pages.length, "arrows do not turn pages while TOC is open");
events.keydown({ key: "Escape" });
assert.equal(body.classList.contains("toc-open"), false);
assert.equal(ids.tocbtn.attributes["aria-expanded"], "false");
assert.equal(ids.tocbtn.focused, true);
events.keydown({ key: " ", target: { closest() { return ids["reader-next"]; } }, preventDefault() { throw Error("button space must stay native"); } });
assert.equal(ids.pg.textContent, "2 / " + pages.length);
for (let n = 0; n < pages.length; n++) ids["reader-next"].onclick();
assert.equal(ids["reader-next"].disabled, true);
assert.equal(ids.pg.textContent, pages.length + " / " + pages.length);
ids.resetbtn.onclick();
assert.equal(ids.pg.textContent, "1 / " + pages.length);
assert.ok(!ids["leaf-pages"].style.transform.includes("NaN"));
context.localStorage.getItem = () => "Infinity";
context.location.hash = "";
vm.runInNewContext(script, context);
assert.equal(ids.pg.textContent, "1 / " + pages.length, "invalid stored position recovers to cover");
project.meta.title = '</script><script>alert("title")</script>';
const hostile = EB.Export.htmlString(project);
assert.equal((hostile.match(/<script>/g) || []).length, 1, "book title cannot inject a script element");
assert.equal((hostile.match(/<\/script>/g) || []).length, 1);
new vm.Script(hostile.match(/<script>([\s\S]*?)<\/script>/)[1]);
console.log("Reader runtime: navigation, boundaries, TOC, keyboard, focus and invalid position passed");
