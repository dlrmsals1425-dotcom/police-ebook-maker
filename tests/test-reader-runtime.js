/* Generated reader navigation runs in a minimal DOM; this is not a layout test. */
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { loadEB } = require("./load-eb");
const EB = loadEB();

function element() {
  const classes = new Set();
  return {
    style: {setProperty(k, v) { this[k] = v; }}, attributes: {}, events: {}, children: [], value: '', textContent: '', offsetWidth: 794, offsetHeight: 1123,
    clientWidth: 1200, clientHeight: 900,
    classList: {
      contains: c => classes.has(c),
      add: c => classes.add(c), remove: c => classes.delete(c),
      toggle(c, on) { on = on === undefined ? !classes.has(c) : on; on ? classes.add(c) : classes.delete(c); return on; }
    },
    setAttribute(k, v) { this.attributes[k] = v; },
    removeAttribute(k) { delete this.attributes[k]; },
    getAttribute(k) { return this.attributes[k]; },
    appendChild(child) { this.children.push(child); child.parent = this; },
    remove() { this.parent.children = this.parent.children.filter(child => child !== this); },
    getBoundingClientRect() { return {width: 390, height: 700, left: 0, top: 0}; },
    querySelectorAll() { return this.children.flatMap(child => [child, ...child.querySelectorAll()]).filter(child => child.getAttribute('id')); },
    cloneNode(deep) {
      const copy = element();
      copy.attributes = {...this.attributes};
      copy.textContent = this.textContent;
      classes.forEach(c => copy.classList.add(c));
      if (deep) this.children.forEach(child => copy.appendChild(child.cloneNode(true)));
      return copy;
    },
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
const excerpts = links.map(element);
links.forEach((a, k) => { a.querySelector = () => excerpts[k]; });
pages[1].textContent = '현장 도착 후 인계 사항을 확인합니다.';
pages[2].textContent = '인계 기록과 ABC 내용을 확인합니다.';
const body = element();
const events = {};
const windowEvents = {};
const doc = {
  body,
  createElement: () => element(),
  getElementById: id => ids[id],
  querySelectorAll: selector => selector === '.ebook-page' ? pages : links,
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
  window: { matchMedia() { return { matches: false }; }, addEventListener(k, fn) { windowEvents[k] = fn; } }
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
assert.equal(ids["toc-search"].focused, true);
assert.equal(ids.desk.inert, true);
ids['toc-search'].value = '인계';
ids['toc-search'].events.input();
assert.equal(links.filter(a => !a.hidden).length, 2, 'search includes body text');
assert.ok(excerpts[1].textContent.includes('인계 사항'));
ids['toc-search'].value = 'abc';
ids['toc-search'].events.input();
assert.equal(links.filter(a => !a.hidden).length, 1, 'search ignores letter case');
ids['toc-search'].value = '<script>missing</script>';
ids['toc-search'].events.input();
assert.equal(links.filter(a => !a.hidden).length, 0);
assert.ok(ids['toc-status'].textContent.includes('검색 결과가 없습니다'));
let trapped = false;
events.keydown({key: 'Tab', target: ids['toc-search'], preventDefault() { trapped = true; }});
assert.equal(trapped, true, 'focus wraps even with no matching links');
assert.equal(ids['toc-close'].focused, true);
ids['toc-search'].value = '   ';
ids['toc-search'].events.input();
assert.equal(links.filter(a => !a.hidden).length, pages.length, 'clearing restores complete TOC');
assert.equal(excerpts[1].textContent, '');
pages[1].scrollTop = 215;
windowEvents.resize();
assert.equal(pages[1].scrollTop, 215, 'resize preserves reading scroll');
assert.equal(body.classList.contains('toc-open'), true, 'resize keeps search open');
events.keydown({ key: "ArrowRight", target: element(), preventDefault() {} });
assert.equal(ids.pg.textContent, "2 / " + pages.length, "arrows do not turn pages while TOC is open");
events.keydown({ key: "Escape" });
assert.equal(body.classList.contains("toc-open"), false);
assert.equal(ids.tocbtn.attributes["aria-expanded"], "false");
assert.equal(ids.tocbtn.focused, true);
assert.equal(ids.desk.inert, false);
context.location.hash = '#p3';
windowEvents.hashchange();
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'page links work after loading');
ids['reader-prev'].onclick();
assert.equal(pages[1].scrollTop, 0, 'page navigation starts at the top');
events.keydown({ key: " ", target: { closest() { return ids["reader-next"]; } }, preventDefault() { throw Error("button space must stay native"); } });
assert.equal(ids.pg.textContent, "2 / " + pages.length);
for (let n = 0; n < pages.length; n++) ids["reader-next"].onclick();
assert.equal(ids["reader-next"].disabled, true);
assert.equal(ids.pg.textContent, pages.length + " / " + pages.length);
ids.resetbtn.onclick();
assert.equal(ids.pg.textContent, "1 / " + pages.length);
assert.ok(!ids["leaf-pages"].style.transform.includes("NaN"));
context.window.matchMedia = q => ({ matches: q.includes('min-') });
ids['reader-next'].onclick();
assert.equal(ids.pg.textContent, '2-3 / ' + pages.length, 'desktop opens a two-page spread');
pages[1].scrollTop = 160;
pages[2].scrollTop = 245;
windowEvents.resize();
assert.equal(pages[1].scrollTop, 160);
assert.equal(pages[2].scrollTop, 245, 'resize preserves both pages in a spread');
context.window.matchMedia = () => ({ matches: false });
windowEvents.resize();
assert.equal(ids.pg.textContent, '2 / ' + pages.length);
assert.equal(pages[1].scrollTop, 160, 'switching to one page preserves position');
// Phone interactions: reading taps and vertical scrolling must not turn pages.
context.window.matchMedia = q => ({ matches: q === '(max-width:720px)' });
ids['toc-search'].focused = false;
ids.tocbtn.onclick();
assert.equal(ids['toc-search'].focused, false, 'opening mobile TOC does not summon the keyboard');
assert.equal(ids['toc-close'].focused, true);
ids['toc-close'].onclick();
const beforeTouch = ids.pg.textContent;
ids.desk.events.click({target: element(), clientX: 195});
assert.equal(ids.pg.textContent, beforeTouch, 'mobile center tap does not turn page');
function touch(x, y, count = 1, target = element()) {
  return {touches: Array.from({length: count}, () => ({clientX: x, clientY: y})),
    changedTouches: [{clientX: x, clientY: y}], target, cancelable: true,
    preventDefault() { this.prevented = true; }};
}
ids.desk.events.touchstart(touch(300, 100));
ids.desk.events.touchmove(touch(250, 160));
ids.desk.events.touchend(touch(160, 160));
assert.equal(ids.pg.textContent, beforeTouch, 'vertical gesture does not become a page swipe');
ids.desk.events.touchstart(touch(300, 100, 2));
ids.desk.events.touchend(touch(160, 100));
assert.equal(ids.pg.textContent, beforeTouch, 'pinch does not turn page');
ids.desk.events.touchstart(touch(300, 100));
ids.desk.events.touchcancel();
ids.desk.events.touchend(touch(160, 100));
assert.equal(ids.pg.textContent, beforeTouch, 'cancelled touch does not turn page');
context.window.getSelection = () => '선택한 문장';
ids.desk.events.touchstart(touch(300, 100));
ids.desk.events.touchend(touch(160, 100));
assert.equal(ids.pg.textContent, beforeTouch, 'text selection does not turn page');
context.window.getSelection = () => '';
ids.desk.events.touchstart(touch(300, 100, 1, {closest: () => ids.tocbtn}));
ids.desk.events.touchend(touch(160, 100));
assert.equal(ids.pg.textContent, beforeTouch, 'interactive content does not start a page swipe');
ids.desk.events.touchstart(touch(300, 100));
ids.desk.events.touchmove(touch(210, 106));
ids.desk.events.touchend(touch(160, 110));
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'deliberate horizontal swipe advances one page');
ids.desk.events.click({target: element(), clientX: 390});
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'swipe and synthetic click cannot advance twice');
context.window.matchMedia = q => ({matches: q === '(max-width:1000px) and (pointer:coarse)' || q.includes('min-')});
windowEvents.resize();
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'landscape phone stays in single-page layout');
assert.equal(ids['leaf-pages'].style.transform, '', 'landscape phone does not shrink a paper page');
// Drive animation frames explicitly: page state must change only after completion.
const frames = new Map();
let frameId = 0, frameTime = 0;
context.window.requestAnimationFrame = fn => { frames.set(++frameId, fn); return frameId; };
context.window.cancelAnimationFrame = id => frames.delete(id);
context.window.matchMedia = q => ({matches: q === '(max-width:720px)'});
function frame(ms = 32) {
  frameTime += ms;
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(fn => fn(frameTime));
}
function finishTurn() {
  for (let n = 0; frames.size && n < 40; n++) frame();
  assert.equal(frames.size, 0, 'animation finishes within bounded frames');
}
const layers = () => ids['leaf-pages'].children;
pages[2].scrollTop = 175;
pages[2].setAttribute('id', 'p3');
const heading = element(); heading.setAttribute('id', 'heading3'); pages[2].appendChild(heading);
const writes = [];
context.localStorage.setItem = (key, value) => writes.push([key, value]);
ids['reader-next'].onclick();
assert.equal(layers().length, 1);
assert.equal(layers()[0].attributes['aria-hidden'], 'true');
assert.equal(layers()[0].inert, true, 'animation copies are not interactive');
const sheet = layers()[0].children[1];
assert.equal(sheet.children[0].scrollTop, 175, 'turn starts with the visible scrolled text');
assert.equal(sheet.children[0].getAttribute('id'), undefined);
assert.equal(sheet.children[0].querySelectorAll('[id]').length, 0, 'copies have no duplicate IDs');
assert.equal(ids.pg.textContent, '3 / ' + pages.length);
assert.equal(writes.length, 0, 'reading position is not saved mid-turn');
frame(); frame(100);
assert.match(sheet.style.transform, /rotateY\(-[1-9]/, 'button turns the page in 3D');
ids['reader-next'].onclick(); ids['reader-prev'].onclick();
assert.equal(layers().length, 1, 'rapid taps cannot create extra turns');
finishTurn();
assert.equal(ids.pg.textContent, '4 / ' + pages.length);
assert.equal(writes.length, 1, 'completed turn saves exactly once');
assert.equal(layers().length, 0);
ids['reader-prev'].onclick();
assert.equal(layers()[0].children[1].style.transform, 'rotateY(-92deg)', 'previous page swings back from the spine');
finishTurn();
assert.equal(ids.pg.textContent, '3 / ' + pages.length);
pages[2].scrollTop = 220;
const writesBeforeCancel = writes.length;
ids.desk.events.touchstart(touch(300, 100));
const drag = touch(260, 105);
ids.desk.events.touchmove(drag);
assert.equal(drag.prevented, true, 'horizontal drag is handled without browser panning');
const firstAngle = layers()[0].children[1].style.transform;
ids.desk.events.touchmove(touch(240, 105));
assert.notEqual(layers()[0].children[1].style.transform, firstAngle, 'paper follows the finger continuously');
ids.desk.events.touchend(touch(260, 105));
finishTurn();
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'short drag returns to original page');
assert.equal(pages[2].scrollTop, 220, 'cancelled drag preserves exact reading position');
assert.equal(writes.length, writesBeforeCancel, 'cancelled drag does not save a different position');
ids.desk.events.touchstart(touch(300, 100));
ids.desk.events.touchmove(touch(160, 108));
ids.desk.events.touchend(touch(160, 108));
assert.equal(ids.pg.textContent, '3 / ' + pages.length);
finishTurn();
assert.equal(ids.pg.textContent, '4 / ' + pages.length, 'sufficient drag completes after settling');
ids.desk.events.touchstart(touch(100, 100));
ids.desk.events.touchmove(touch(250, 108));
ids.desk.events.touchend(touch(250, 108));
finishTurn();
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'rightward drag returns to previous page');
ids.desk.events.touchstart(touch(300, 100));
ids.desk.events.touchmove(touch(180, 105));
ids.desk.events.touchmove(touch(170, 150));
ids.desk.events.touchend(touch(140, 150));
finishTurn();
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'vertical motion cancels an in-progress turn');
ids.desk.events.touchstart(touch(300, 100));
ids.desk.events.touchmove(touch(180, 105));
ids.desk.events.touchcancel();
finishTurn();
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'touch cancellation rolls paper back');
ids['reader-next'].onclick(); frame();
windowEvents.resize();
assert.equal(layers().length, 0, 'resize removes transient paper');
assert.equal(frames.size, 0);
assert.equal(ids.pg.textContent, '3 / ' + pages.length, 'resize cancels uncommitted navigation');
ids['reader-next'].onclick();
ids.tocbtn.onclick();
assert.equal(layers().length, 0, 'opening TOC cancels the turn');
ids['toc-close'].onclick();
ids['reader-next'].onclick();
doc.hidden = true; events.visibilitychange(); doc.hidden = false;
assert.equal(layers().length, 0, 'backgrounding cannot leave a stuck overlay');
ids['reader-next'].onclick(); windowEvents.beforeprint();
assert.equal(layers().length, 0, 'print does not contain temporary copies');
context.window.matchMedia = q => ({matches: q === '(max-width:720px)' || q === '(prefers-reduced-motion:reduce)'});
ids['reader-next'].onclick();
assert.equal(ids.pg.textContent, '4 / ' + pages.length, 'reduced motion uses immediate navigation');
assert.equal(layers().length, 0);
context.window.matchMedia = q => ({matches: q === '(max-width:720px)'});
ids.resetbtn.onclick(); pages[0].scrollTop = 90;
ids['reader-prev'].onclick();
assert.equal(layers().length, 0);
assert.equal(pages[0].scrollTop, 90, 'cover boundary does not reset scrolling');
context.location.hash = '#p' + pages.length; windowEvents.hashchange();
ids['reader-next'].onclick();
assert.equal(layers().length, 0, 'last page cannot turn past the end');
// Mobile edge taps share the turn animation; scroll release must not count as a tap.
let touchClock = Date.now() + 10000;
context.Date = {now: () => touchClock};
ids.resetbtn.onclick();
ids.desk.events.touchstart(touch(375, 100));
ids.desk.events.touchend(touch(375, 100));
ids.desk.events.click({target: element(), clientX: 375});
assert.equal(layers().length, 1, 'right edge tap starts a page turn on mobile');
finishTurn();
assert.equal(ids.pg.textContent, '2 / ' + pages.length);
touchClock += 1000;
ids.desk.events.click({target: element(), clientX: 15});
finishTurn();
assert.equal(ids.pg.textContent, '1 / ' + pages.length, 'left edge tap returns to previous page');
ids.desk.events.touchstart(touch(375, 100));
ids.desk.events.touchmove(touch(370, 200));
ids.desk.events.touchend(touch(370, 220));
ids.desk.events.click({target: element(), clientX: 370});
assert.equal(layers().length, 0, 'edge scroll release cannot become an accidental tap');
assert.equal(ids.pg.textContent, '1 / ' + pages.length);
context.localStorage.getItem = () => "Infinity";
context.location.hash = "";
vm.runInNewContext(script, context);
assert.equal(ids.pg.textContent, "1 / " + pages.length, "invalid stored position recovers to cover");
const previewHtml = EB.Export.htmlString(project, {startIndex: 4, preview: true});
context.window.matchMedia = q => ({matches: q.includes('min-') || q === '(prefers-reduced-motion:reduce)'});
context.localStorage.getItem = context.localStorage.setItem = () => { throw new Error('sandbox storage blocked'); };
context.history.replaceState = () => { throw new Error('sandbox history blocked'); };
vm.runInNewContext(previewHtml.match(/<script>([\s\S]*?)<\/script>/)[1], context);
assert.equal(ids.pg.textContent, '5 / ' + pages.length, 'sandboxed preview opens the requested editor page');
ids['reader-next'].onclick();
assert.equal(ids.pg.textContent, '5 / ' + pages.length, 'explicit preview must not immediately switch even when reduced motion is enabled');
assert.equal(layers().length, 1, 'preview animates on wide desktops with reduced motion enabled');
frame(); frame(100);
assert.match(layers()[0].children[1].style.transform, /rotateY\(-[1-9]/);
assert.equal(ids.pg.textContent, '5 / ' + pages.length, 'preview retains intermediate animation frames');
finishTurn();
assert.equal(ids.pg.textContent, '6 / ' + pages.length, '3D navigation works with sandboxed storage and history');
let mouseClock = Date.now() + 10000;
context.Date = {now: () => mouseClock};
function mouse(x, y, extras = {}) {
  return {button: 0, clientX: x, clientY: y, target: element(),
    preventDefault() { this.prevented = true; }, ...extras};
}
ids.desk.events.mousedown(mouse(330, 100));
events.mousemove(mouse(180, 106));
assert.equal(layers().length, 1, 'mouse drag creates the turning page');
assert.match(layers()[0].children[1].style.transform, /rotateY\(-[1-9]/);
assert.equal(ids.desk.classList.contains('is-dragging'), true);
events.mouseup(mouse(150, 108));
finishTurn();
assert.equal(ids.pg.textContent, '7 / ' + pages.length, 'mouse drag advances a page');
ids.desk.events.click(mouse(380, 108));
assert.equal(layers().length, 0, 'release click cannot turn a second page');
assert.equal(ids.desk.classList.contains('is-dragging'), false);
mouseClock += 1000;
pages[6].scrollTop = 180;
ids.desk.events.mousedown(mouse(330, 100));
events.mousemove(mouse(285, 104));
events.mouseup(mouse(285, 104));
finishTurn();
assert.equal(ids.pg.textContent, '7 / ' + pages.length, 'short mouse drag rolls back');
assert.equal(pages[6].scrollTop, 180);
mouseClock += 1000;
ids.desk.events.mousedown(mouse(100, 100));
events.mousemove(mouse(250, 104));
events.mouseup(mouse(460, 104));
finishTurn();
assert.equal(ids.pg.textContent, '6 / ' + pages.length, 'release outside book completes previous-page drag');
mouseClock += 1000;
const selectMouse = mouse(300, 100, {shiftKey: true});
ids.desk.events.mousedown(selectMouse);
events.mousemove(mouse(150, 100));
events.mouseup(mouse(150, 100));
assert.equal(selectMouse.prevented, undefined, 'shift-drag retains native text selection');
assert.equal(layers().length, 0);
ids.desk.events.mousedown(mouse(300, 100, {target: {closest: () => ids.tocbtn}}));
events.mousemove(mouse(150, 100));
events.mouseup(mouse(150, 100));
assert.equal(layers().length, 0, 'interactive content is excluded from mouse dragging');
ids.desk.events.mousedown(mouse(300, 100));
events.mousemove(mouse(150, 105));
windowEvents.blur();
finishTurn();
assert.equal(ids.pg.textContent, '6 / ' + pages.length, 'leaving the browser rolls back an unfinished mouse drag');
assert.equal(layers().length, 0);
project.meta.title = '</script><script>alert("title")</script>';
const hostile = EB.Export.htmlString(project);
assert.equal((hostile.match(/<script>/g) || []).length, 1, "book title cannot inject a script element");
assert.equal((hostile.match(/<\/script>/g) || []).length, 1);
new vm.Script(hostile.match(/<script>([\s\S]*?)<\/script>/)[1]);
console.log("Reader runtime: 3D turns, drag/rollback, interruption, reduced motion, mobile gestures, search and navigation passed");
