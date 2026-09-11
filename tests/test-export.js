/* node tests/test-export.js */
const fs = require("fs");
const path = require("path");
const { root, loadEB } = require("./load-eb");

const EB = loadEB();
let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok  ", msg);
  }
}

const md = fs.readFileSync(path.join(root, "samples", "전자책_활용가이드.md"), "utf8");
const project = EB.Markdown.parse(md);
assert(project.pages.length > 5, "활용가이드 pages > 5");

const html = EB.Export.htmlString(project);
assert(html.indexOf('body class="ebook"') !== -1, "ebook body");
assert(html.indexOf("cover-emblem") !== -1, "cover uses station emblem");
assert(html.indexOf("cover-photo") !== -1, "cover uses station photo");
assert(html.indexOf("고양경찰서") !== -1, "cover names 고양경찰서");
assert(html.indexOf('class="leaf-pages"') !== -1, "book leaf");
assert(html.indexOf('id="toc"') !== -1, "toc overlay");
assert(html.indexOf('id="resetbtn"') !== -1, "reset to first page");
assert(html.indexOf(">처음<") !== -1, "reset button is labelled");
assert(html.indexOf('id="p1"') !== -1, "page anchors");
assert(html.indexOf("is-open") !== -1, "one open page");
assert(html.indexOf("touchend") !== -1, "swipe to turn");
assert(html.indexOf("is-spread") !== -1, "two-page spread on wide screens");
assert(html.indexOf('id="fontbtn"') !== -1, "reader can change text size");
assert(html.indexOf('id="bar"') !== -1, "reading progress bar");
assert(html.indexOf("(max-width:720px)") !== -1, "phone layout rules");
assert(!/epub/i.test(html), "no epub leftovers");
assert(html.indexOf("class=\"mbook\"") === -1, "not a stacked feed");
assert((html.match(/class="ebook-page/g) || []).length === project.pages.length, "one article per page");

const sample = EB.buildSampleProject();
const sampleHtml = EB.Export.htmlString(sample);
assert(sampleHtml.indexOf("112 중요사건") !== -1, "sample reader title");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("all export tests passed");
