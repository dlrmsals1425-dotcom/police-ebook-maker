/* node tests/build-css.js — tokens+pages+print 을 js/ebook-css.js 로 묶는다 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const css = ["css/tokens.css", "css/pages.css", "css/print.css"]
  .map(function (rel) {
    return fs.readFileSync(path.join(root, rel), "utf8");
  })
  .join("\n\n");
if (css.indexOf("`") !== -1) {
  throw new Error("CSS must not contain backticks");
}
const out =
  "/* 자동 생성: node tests/build-css.js */\n(function(g){g.EB=g.EB||{};g.EB.EXPORT_CSS = `" +
  css +
  "`;\n})(typeof window !== \"undefined\" ? window : global);\n";
fs.writeFileSync(path.join(root, "js/ebook-css.js"), out);
console.log("wrote js/ebook-css.js", out.length, "chars");
