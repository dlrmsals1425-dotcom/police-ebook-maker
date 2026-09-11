/* node tests/build-emblem.js */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

function dataUrl(rel) {
  const buf = fs.readFileSync(path.join(root, rel));
  return "data:image/jpeg;base64," + buf.toString("base64");
}

const emblem = dataUrl(path.join("assets", "goyang-emblem.jpg"));
const photo = dataUrl(path.join("assets", "goyang-station.jpg"));
const js =
  "/* 고양경찰서 휘장·전경 — 표지용 */\n(function (g) {\n  g.EB = g.EB || {};\n  g.EB.COVER_EMBLEM = " +
  JSON.stringify(emblem) +
  ";\n  g.EB.COVER_PHOTO = " +
  JSON.stringify(photo) +
  ";\n})(typeof window !== \"undefined\" ? window : global);\n";
fs.writeFileSync(path.join(root, "js", "cover-emblem.js"), js);
console.log("wrote js/cover-emblem.js", js.length);
