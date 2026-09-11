/* node에서 제작기 JS를 불러온다 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");

function loadEB() {
  const context = {
    console: console,
    Date: Date,
    Math: Math,
    JSON: JSON,
    Number: Number,
    String: String,
    Array: Array,
    Object: Object,
    Error: Error,
    parseInt: parseInt,
    isFinite: isFinite,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    TextEncoder: TextEncoder,
    Uint8Array: Uint8Array,
    Uint32Array: Uint32Array
  };
  context.window = context;
  context.global = context;
  function load(rel) {
    const file = path.join(root, rel);
    vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  }
  load("js/util.js");
  load("js/cover-emblem.js");
  load("js/model.js");
  load("js/markdown.js");
  load("js/lint.js");
  load("js/sample.js");
  load("js/render.js");
  load("js/ebook-css.js");
  load("js/zip.js");
  load("js/export.js");
  return context.EB;
}

module.exports = { root: root, loadEB: loadEB };
