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
assert(html.indexOf('class="reader"') !== -1, "reader body class");
assert(html.indexOf('id="r-toc"') !== -1, "toc drawer");
assert(html.indexOf('id="r-night"') !== -1, "night toggle");
assert(html.indexOf("is-current") === -1 || html.indexOf("toggle('is-current'") !== -1, "page turn script");
assert(html.indexOf("touchend") !== -1, "swipe handler");
assert(html.indexOf("page-fit") === -1, "no old A4 scale wrapper");
assert((html.match(/class="ebook-page/g) || []).length === project.pages.length, "one article per page");

const zip = EB.Export.epubBytes(project);
assert(zip instanceof Uint8Array, "epub is bytes");
assert(zip[0] === 0x50 && zip[1] === 0x4b, "zip magic PK");
const mimeName = "mimetype";
const nameAt = 30;
const gotName = String.fromCharCode.apply(null, zip.slice(nameAt, nameAt + mimeName.length));
assert(gotName === mimeName, "mimetype is first zip entry, extra=0");
const mimeData = String.fromCharCode.apply(
  null,
  zip.slice(nameAt + mimeName.length, nameAt + mimeName.length + "application/epub+zip".length)
);
assert(mimeData === "application/epub+zip", "mimetype payload");

const asText = Buffer.from(zip).toString("utf8");
assert(asText.indexOf("application/epub+zip") !== -1, "epub mimetype inside zip");
assert(asText.indexOf("OEBPS/content.opf") !== -1, "container points to opf");
assert(asText.indexOf("epub:type=\"toc\"") !== -1, "nav toc");
assert(asText.indexOf("<html xmlns=\"http://www.w3.org/1999/xhtml\"") !== -1, "xhtml pages");

const sample = EB.buildSampleProject();
const sampleHtml = EB.Export.htmlString(sample);
assert(sampleHtml.indexOf("112 중요사건") !== -1, "sample reader title");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("all export tests passed");
