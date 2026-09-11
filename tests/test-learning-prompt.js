const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { root, loadEB } = require("./load-eb");
const EB = loadEB();

assert.equal(fs.readFileSync(path.join(root, "prompts", EB.MASTER_PROMPT_FILENAME), "utf8"), EB.MASTER_PROMPT, "downloaded and bundled prompts agree");
const raw = '관찰 사실 $& $1 <tag> {{대상직원}}\n원문 미기재';
const prepared = EB.buildMasterPrompt({ audience: "신규자", goal: "인계 정보를 구분한다", material: raw });
assert.ok(prepared.includes("대상 직원: 신규자"));
assert.ok(prepared.includes("읽은 뒤 달라질 행동: 인계 정보를 구분한다"));
assert.ok(prepared.endsWith(raw + "\n"), "source text survives replacement literally, including template-like strings");
assert.ok(!EB.buildMasterPrompt().includes("{{원본자료}}"), "blank input provides a usable fill-in instruction");

const md = fs.readFileSync(path.join(root, "samples", "역량향상_인계메모_완성예시.md"), "utf8");
const project = EB.Markdown.parse(md);
assert.equal(project.pages.length, 10, "one ten-page learning booklet, without accidental splits");
const questions = project.pages.find(p => p.title === "스스로 판단해 보기");
const answers = project.pages.find(p => p.title === "판단의 이유 맞춰 보기");
assert.equal(questions.type, "content");
assert.equal(answers.type, "content");
assert.ok(project.pages.indexOf(answers) > project.pages.indexOf(questions));
assert.equal(project.pages.flatMap(p => p.blocks).filter(b => b.type === "flow").length, 0, "no accidental six-step empty case cards");
assert.equal(project.pages.filter(p => p.type === "dodont").length, 1);
const checklist = project.pages.find(p => p.type === "checklist").blocks.find(b => b.type === "checklist");
assert.equal(checklist.groups.flatMap(g => g.items).length, 4);
assert.ok(checklist.groups.flatMap(g => g.items).every(i => i.text));
assert.equal(project.meta.date, "확인 필요", "no invented publication date");
assert.equal(project.meta.version, "초안");
const html = EB.Export.htmlString(project);
for (const text of ["①", "②", "자료 1", "학습용 가상 상황", "확인 필요", "공식 인계 규정은 아니다"]) {
  assert.ok(html.includes(text), "preserved: " + text);
}
const report = EB.Lint.analyze(project);
assert.equal(report.errorCount, 0, JSON.stringify(report.issues));
assert.equal(report.warnCount, 0, JSON.stringify(report.issues));
// A type hint must preserve prose even if the title would normally trigger a summary.
const forced = EB.Markdown.parse("---\ntitle: 테스트\n---\n<!-- page: content -->\n# 한눈에 판단하기\n\n> point: 질문을 읽는다.\n\n이유를 먼저 말한다.\n\n> summary: 근거를 확인한다.");
assert.equal(forced.pages[2].type, "content");
console.log("Learning prompt: synchronization, inputs, 10-page structure, quiz, checklist and source labels passed");
