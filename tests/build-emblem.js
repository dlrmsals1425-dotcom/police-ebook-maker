/* node tests/build-emblem.js */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const img = fs.readFileSync(path.join(root, "assets", "goyang-emblem.jpg"));
const data = "data:image/jpeg;base64," + img.toString("base64");
const js =
  "/* 고양경찰서 휘장 — 표지용 */\n(function (g) {\n  g.EB = g.EB || {};\n  g.EB.COVER_EMBLEM = " +
  JSON.stringify(data) +
  ";\n})(typeof window !== \"undefined\" ? window : global);\n";
fs.writeFileSync(path.join(root, "js", "cover-emblem.js"), js);
console.log("wrote js/cover-emblem.js", js.length);
