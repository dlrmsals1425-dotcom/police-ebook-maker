/* node tests/test-markdown.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
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
  clearTimeout: clearTimeout
};
context.window = context;
context.global = context;

function load(rel) {
  const file = path.join(root, rel);
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

load("js/util.js");
load("js/model.js");
load("js/markdown.js");
load("js/lint.js");
load("js/master-prompt.js");

const EB = context.EB;
let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok  ", msg);
  }
}

function types(project) {
  return project.pages.map(function (p) {
    return p.type;
  });
}

function blockTypes(page) {
  return (page.blocks || []).map(function (b) {
    return b.type;
  });
}

/* 1 empty */
try {
  EB.Markdown.parse("   \n");
  assert(false, "empty markdown should throw");
} catch (e) {
  assert(e.code === "EMPTY", "empty markdown throws EMPTY");
}

/* 2 user example */
const example = [
  "# 가정폭력 신고 현장조치",
  "",
  "## 핵심포인트",
  "피해자 안전확보를 최우선으로 한다.",
  "",
  "## 현장상황",
  "신고자가 배우자의 폭행을 신고하였다.",
  "",
  "## 조치내용",
  "- 가해자와 피해자를 분리하였다.",
  "- 피해상태를 확인하였다.",
  "- 긴급임시조치 필요성을 검토하였다.",
  "",
  "## 참고사항",
  "피해자가 처벌을 원하지 않더라도 현장 위험성을 별도로 판단한다.",
  "",
  "## 요약",
  "피해자의 의사만으로 현장조치 필요성을 판단하지 않는다.",
  ""
].join("\n");

const book = EB.Markdown.parse(example);
assert(book.meta.title.indexOf("가정폭력") !== -1, "title from first H1");
assert(types(book)[0] === "cover", "first page is cover");
assert(types(book)[1] === "toc", "second page is toc");
const bodyPages = book.pages.filter(function (p) {
  return p.type !== "cover" && p.type !== "toc";
});
assert(bodyPages.length >= 1, "at least one content page");
const joinedTypes = bodyPages
  .map(function (p) {
    return blockTypes(p).join(",");
  })
  .join("|");
assert(joinedTypes.indexOf("point") !== -1, "point block created");
assert(joinedTypes.indexOf("summary") !== -1, "summary block created");
assert(joinedTypes.indexOf("tip") !== -1 || joinedTypes.indexOf("warning") !== -1 || joinedTypes.indexOf("flow") !== -1, "tip or flow from 현장/참고");

/* 3 callouts */
const callouts = EB.Markdown.parse(
  [
    "# 제목",
    "> point: 핵심이다",
    "> tip: 팁이다",
    "> warning: 주의다",
    "> law: 법령이다",
    "> example: 사례다",
    "> summary: 요약이다"
  ].join("\n")
);
const allB = [];
callouts.pages.forEach(function (p) {
  (p.blocks || []).forEach(function (b) {
    allB.push(b.type);
  });
});
["point", "tip", "warning", "law", "example", "summary"].forEach(function (t) {
  assert(allB.indexOf(t) !== -1, "callout " + t);
});

/* 4 chapter */
const ch = EB.Markdown.parse(
  ["# CHAPTER 01 현장 도착 전", "- 출동 전 확인", "- 역할 분담", "# 출동 전 확인사항", "> point: 출발 전 위험을 고정한다."].join("\n")
);
assert(
  ch.pages.some(function (p) {
    return p.type === "chapter" && p.chapterNo === "01";
  }),
  "chapter 01 created"
);

/* 5 pagination: one message per page */
const bullets = [];
for (let i = 1; i <= 24; i++) bullets.push("- 항목 " + i + " 현장 확인 내용을 구체적으로 적는다.");
const long = EB.Markdown.parse("# 긴 목록\n\n## 확인\n\n" + bullets.join("\n"));
const contentCount = long.pages.filter(function (p) {
  return p.type !== "cover" && p.type !== "toc";
}).length;
assert(contentCount >= 2, "long list splits into multiple pages, got " + contentCount);

/* 6 BOM */
const bom = EB.Markdown.parse("\uFEFF# 제목\n\n본문입니다.");
assert(bom.meta.title === "제목", "BOM stripped");

/* 7 roundtrip */
const md = EB.Markdown.toMarkdown(book);
assert(md.indexOf("title:") !== -1, "export has frontmatter");
assert(md.indexOf("point:") !== -1 || md.indexOf("가정폭력") !== -1, "export keeps content");
const again = EB.Markdown.parse(md);
assert(again.meta.title.length > 0, "re-import has title");

/* 8 sample file */
const samplePath = path.join(root, "samples", "가정폭력_현장조치.md");
const sampleMd = fs.readFileSync(samplePath, "utf8");
const sampleBook = EB.Markdown.parse(sampleMd);
assert(sampleBook.pages.length >= 6, "sample md produces several pages: " + sampleBook.pages.length);
assert(
  sampleBook.pages.some(function (p) {
    return p.type === "dodont";
  }),
  "sample includes dodont page"
);

/* 9 invalid-ish still parses */
const weird = EB.Markdown.parse("본문만 있는 파일입니다.\n두 번째 줄.");
assert(weird.pages.length >= 3, "paragraph-only file still makes a book");

load("js/sample.js");
const sampleProj = EB.buildSampleProject();
assert(sampleProj.pages.length >= 18, "sample ebook has enough pages: " + sampleProj.pages.length);
const sampleTypes = {};
sampleProj.pages.forEach(function (p) {
  sampleTypes[p.type] = true;
});
["cover", "toc", "chapter", "content", "case", "dodont", "checklist", "law", "summary"].forEach(function (t) {
  assert(sampleTypes[t], "sample includes page type " + t);
});
assert(sampleProj.meta.title.indexOf("112") !== -1, "sample title");

assert(EB.MASTER_PROMPT.indexOf("[원본자료]") !== -1, "master prompt has source slot");
assert(EB.MASTER_PROMPT.indexOf("> point:") !== -1, "master prompt has point syntax");
assert(EB.MASTER_PROMPT.indexOf("<!-- page: case -->") !== -1, "master prompt has case page");
assert(EB.MASTER_PROMPT.indexOf("분량 제한") !== -1, "master prompt has length limits");

const longPage = EB.createPage("content", "제목이 지나치게 길어서 한 줄에 다 들어가지 않는 교육자료 제목입니다");
longPage.blocks = [
  EB.createBlock("point", {
    text: "현장에서 피해자가 처벌을 원하지 않는다고 진술하였으나 관련 법령 및 내부 지침에 의거 위험성 여부를 종합적으로 검토한 후 필요시 긴급임시조치 등 적절한 보호조치를 강구하여야 한다."
  }),
  EB.createBlock("paragraph", { text: "내용을 입력하세요." })
];
const lintBook = {
  id: "t",
  meta: { title: "새 교육 전자책", subtitle: "", category: "", department: "", date: "", version: "" },
  pages: [EB.createPage("cover", "새 교육 전자책"), longPage]
};
const lint = EB.Lint.analyze(lintBook);
assert(lint.errorCount + lint.warnCount >= 2, "lint flags long text and empty cover: " + (lint.errorCount + lint.warnCount));
assert(
  lint.issues.some(function (x) {
    return /핵심포인트/.test(x.message);
  }),
  "lint mentions 핵심포인트"
);
assert(
  lint.issues.some(function (x) {
    return x.pageId === longPage.id;
  }),
  "lint points at the long page"
);

const sampleLint = EB.Lint.analyze(sampleProj);
assert(sampleLint.errorCount === 0, "sample ebook has no lint errors, got " + sampleLint.errorCount);

if (failed) {
  console.error("\n" + failed + " failed");
  process.exit(1);
}
console.log("\nall tests passed");
