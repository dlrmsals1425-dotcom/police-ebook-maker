/* js/master-prompt.js 의 본문을 prompts/*.md 로 내보낸다.
   node tests/build-prompt.js */
const fs = require("fs");
const path = require("path");
const { root, loadEB } = require("./load-eb");

const EB = loadEB();
const out = path.join(root, "prompts", EB.MASTER_PROMPT_FILENAME);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, EB.MASTER_PROMPT, "utf8");
console.log("wrote", out, EB.MASTER_PROMPT.length, "chars");
