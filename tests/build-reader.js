/* Markdown → 전자책 HTML
   node tests/build-reader.js [input.md] [output.html] */
const fs = require("fs");
const path = require("path");
const { root, loadEB } = require("./load-eb");

const args = process.argv.slice(2);

const input = args[0]
  ? path.resolve(args[0])
  : path.join(root, "samples", "전자책_활용가이드.md");
const output = args[1] ? path.resolve(args[1]) : path.join(root, "book.html");

const EB = loadEB();
const md = fs.readFileSync(input, "utf8");
const project = EB.Markdown.parse(md);
const html = EB.Export.htmlString(project);
fs.writeFileSync(output, html, "utf8");
console.log("wrote", output, project.pages.length, "pages");

const extras = [
  {
    md: path.join(root, "samples", "2025상반기_현장조치_교훈.md"),
    htmls: [
      path.join(root, "samples", "현장조치_교훈_카드.html"),
      "C:/Users/이근민/Downloads/현장조치_교훈_카드.html",
      "D:/지역/현장조치_교훈_카드.html"
    ]
  }
];

if (!args[0]) {
  extras.forEach(function (job) {
    if (!fs.existsSync(job.md)) return;
    const p = EB.Markdown.parse(fs.readFileSync(job.md, "utf8"));
    const h = EB.Export.htmlString(p);
    job.htmls.forEach(function (dest) {
      try {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, h, "utf8");
        console.log("wrote", dest, p.pages.length, "pages");
      } catch (e) {
        console.log("skip", dest, e.message);
      }
    });
  });
}
