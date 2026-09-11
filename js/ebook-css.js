/* 자동 생성: node tests/build-css.js */
(function(g){g.EB=g.EB||{};g.EB.EXPORT_CSS = `/* 경찰 교육 전자책 — 디자인 토큰
   외부 폰트/CDN 없이 시스템 한글 폰트 fallback
   본문은 명조(바탕) 계열, 제목·라벨은 고딕 계열이다. */
:root {
  /* 잉크 — 순검정 대신 따뜻한 먹색 */
  --ink: #23252b;
  --ink-2: #474d58;
  --muted: #7b8290;
  --line: #ddd6c7;
  --line-soft: #e9e3d6;
  --line-strong: #c3bba8;

  /* 종이 — 미색 */
  --paper: #fbf8f1;
  --paper-2: #f5f1e6;
  --paper-edge: #efe9db;

  /* 표제 색 */
  --navy-950: #071221;
  --navy-900: #12263f;
  --navy-800: #1b3a5c;
  --navy-700: #27537f;
  --navy-600: #34689a;
  --blue-500: #3d6f9f;
  --blue-400: #5e8cb6;
  --blue-100: #e6eef5;
  --gold: #96763a;
  --gold-soft: #c9ad6e;

  /* 편집기 크롬 */
  --canvas: #2e2a26;
  --sidebar: #f5f3ee;
  --chrome: #12263f;

  /* 본문 장치 — 종이 위에 얹은 느낌으로 채도를 낮춘다 */
  --point-bg: #eef1ea;
  --point-fg: #12263f;
  --tip-bg: #eef3ec;
  --tip-fg: #3c6a4a;
  --tip-line: #7fa389;
  --warn-bg: #f8efe6;
  --warn-fg: #9a5a22;
  --warn-line: #c99a68;
  --law-bg: #f4efe2;
  --law-fg: #6b5526;
  --law-line: #b8a06a;
  --example-bg: #f1eef3;
  --example-fg: #5c4a76;
  --do-bg: #eef3ec;
  --do-fg: #3c6a4a;
  --dont-bg: #f7ecea;
  --dont-fg: #93443a;
  --summary-bg: #12263f;

  --danger: #a4382c;
  --ok: #3c6a4a;

  --font: "Pretendard", "Pretendard Variable", "Noto Sans KR",
    "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif;
  --font-serif: "Noto Serif KR", "Nanum Myeongjo", "나눔명조", "함초롬바탕",
    "Batang", "바탕", "AppleMyungjo", "Times New Roman", serif;
  --font-mono: "Cascadia Code", "D2Coding", "Consolas", monospace;

  /* 독자가 조절하는 배율 — 리더에서 --fs-scale 만 바꾸면 책 전체가 따라 커진다 */
  --fs-scale: 1;
  --fs-body: calc(15.5px * var(--fs-scale));

  --lh-tight: 1.25;
  --lh-body: 1.78;
  --radius: 2px;
  --shadow-page: 0 16px 42px rgba(35, 30, 22, 0.22), 0 2px 6px rgba(35, 30, 22, 0.1);

  /* 신국판 152 × 225mm */
  --page-w: 152mm;
  --page-h: 225mm;
  --page-pad-x: 15mm;
  --page-pad-y: 13mm;
  --page-pad-bottom: 8mm;

  --toolbar-h: 56px;
  --nav-w: 268px;
  --ins-w: 292px;
}


/* 전자책 페이지 템플릿 — 화면·인쇄 공통
   판형은 신국판(152×225mm). 글자 크기는 .ebook-page 의 font-size 를 기준으로
   모두 em 으로 잡아, --fs-scale 하나만 바꾸면 책 전체가 같은 비율로 커진다. */

.ebook-page {
  width: var(--page-w);
  height: var(--page-h);
  background: var(--paper);
  color: var(--ink);
  box-shadow: var(--shadow-page);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: var(--font-serif);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  word-break: keep-all;
  overflow-wrap: break-word;
}

.page-inner {
  flex: 1 1 0;
  padding: var(--page-pad-y) var(--page-pad-x) 4mm;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

/* ——— 페이지 머리: 장 제목(러닝헤드) + 제목 ——— */
.page-head {
  flex: 0 0 auto;
  padding-bottom: 3.5mm;
  margin-bottom: 6mm;
  border-bottom: 1px solid var(--line);
}

.page-head .point-bar {
  margin: 5mm 0 0;
}

.page-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 4.5mm;
  min-height: min-content;
  justify-content: flex-start;
}

.page-body:has(.flow),
.page-body:has(.dodont),
.page-body:has(.law-card),
.page-body:has(.check-group) {
  justify-content: stretch;
  gap: 3.5mm;
}

.page-body .blk:has(.flow),
.page-body .blk:has(.dodont),
.page-body .blk:has(.law-card),
.page-body .blk:has(.check-group) {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  min-height: min-content;
}

.page-end {
  flex: 0 0 auto;
  margin-top: 5mm;
  position: relative;
  z-index: 2;
}

/* ——— 쪽번호(folio) ——— */
.page-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--page-pad-x) var(--page-pad-bottom);
  flex: 0 0 auto;
}

.page-footer .folio {
  font-family: var(--font-serif);
  font-size: 0.78em;
  letter-spacing: 0.18em;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.page-footer .folio::before,
.page-footer .folio::after {
  content: "·";
  color: var(--line-strong);
  margin: 0 0.7em;
}

.ebook-page.is-navy {
  background: var(--navy-900);
  color: #edf1f6;
}

.ebook-page.is-navy .page-footer .folio {
  color: rgba(201, 173, 110, 0.75);
}

.ebook-page.is-navy .page-footer .folio::before,
.ebook-page.is-navy .page-footer .folio::after {
  color: rgba(201, 173, 110, 0.4);
}

.ebook-page.is-mist {
  background: var(--paper-2);
}

.ebook-page.is-cover {
  background: var(--paper);
}

/* ——— 공통 타이포 ——— */
.kicker {
  font-family: var(--font);
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--gold);
  margin-bottom: 0.6em;
}

.pg-title {
  margin: 0;
  font-family: var(--font);
  font-size: 1.72em;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: var(--lh-tight);
  color: var(--navy-900);
}

.pg-title.size-sm { font-size: 1.45em; }
.pg-title.size-lg { font-size: 2.05em; }

.pg-sub {
  margin: 0.5em 0 0;
  font-size: 0.95em;
  color: var(--ink-2);
  line-height: 1.6;
}

.blk + .blk {
  margin-top: 0;
}

.blk.learn-box {
  margin-top: auto;
}

.h-block {
  margin: 0;
  font-family: var(--font);
  font-size: 1.14em;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--navy-800);
  line-height: 1.45;
}

.h-block::after {
  content: "";
  display: block;
  width: 2.2em;
  height: 2px;
  background: var(--gold);
  margin-top: 0.45em;
  opacity: 0.65;
}

.h-block.lv3 {
  font-size: 1em;
  font-weight: 600;
  color: var(--ink-2);
}

.h-block.lv3::after {
  display: none;
}

.p-block {
  margin: 0;
  font-size: 1em;
  line-height: var(--lh-body);
  color: var(--ink);
  text-align: justify;
  text-justify: inter-character;
}

.bullets {
  margin: 0;
  padding-left: 1.1em;
  list-style: none;
}

.bullets li {
  font-size: 1em;
  line-height: 1.72;
  margin: 0.45em 0;
  position: relative;
}

.bullets li::before {
  content: "";
  position: absolute;
  left: -0.95em;
  top: 0.78em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold);
}

/* ——— 표지 ——— */
.cover-top {
  background: var(--navy-900);
  color: #fff;
  padding: 13mm 15mm 14mm;
  position: relative;
  overflow: hidden;
  flex: 1.6 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.cover-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;
  z-index: 0;
  filter: saturate(0.72) contrast(1.02);
}

.cover-top::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      to top,
      rgba(7, 16, 28, 0.96) 0%,
      rgba(7, 16, 28, 0.78) 34%,
      rgba(7, 16, 28, 0.42) 66%,
      rgba(7, 16, 28, 0.3) 100%
    );
  pointer-events: none;
}

/* 표지 안쪽 금박 테두리 */
.cover-top::after {
  content: "";
  position: absolute;
  inset: 6mm;
  z-index: 1;
  border: 1px solid rgba(201, 173, 110, 0.38);
  pointer-events: none;
}

.cover-emblem {
  width: 22mm;
  height: 22mm;
  object-fit: contain;
  border-radius: 50%;
  background: #fff;
  margin: 2mm auto 0;
  z-index: 2;
  box-shadow:
    0 0 0 1.5px rgba(201, 173, 110, 0.9),
    0 8px 20px rgba(0, 0, 0, 0.35);
}

.cover-mark {
  width: 20mm;
  height: 20mm;
  color: var(--gold-soft);
  margin: 2mm auto 0;
  z-index: 2;
}

.cover-kicker {
  z-index: 2;
  margin: auto auto 1.1em;
  font-family: var(--font);
  font-size: 0.76em;
  letter-spacing: 0.24em;
  color: var(--gold-soft);
  font-weight: 600;
  text-align: center;
}

.cover-kicker:empty {
  display: none;
}

/* 편집기에서는 비어 있어도 눌러서 쓸 수 있게 남긴다 */
.cover-kicker[contenteditable]:empty {
  display: block;
}

.cover-kicker[contenteditable]:empty::before {
  content: "분류 (선택)";
  color: rgba(201, 173, 110, 0.5);
}

.cover-kicker:not(:has(+ .cover-title)) {
  margin-bottom: 0;
}

.cover-title {
  z-index: 2;
  margin: 0;
  font-family: var(--font-serif);
  font-size: 2.35em;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  text-align: center;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
}

.cover-title::after {
  content: "";
  display: block;
  width: 12mm;
  height: 2px;
  background: var(--gold-soft);
  margin: 0.8em auto 0;
}

.cover-sub {
  z-index: 2;
  margin: 1em auto 0;
  font-size: 0.97em;
  color: #d6dfe9;
  text-align: center;
  line-height: 1.6;
  max-width: 90%;
}

.cover-rule {
  height: 3px;
  background: var(--gold);
  border: 0;
  margin: 0;
}

.cover-bottom {
  flex: 0.52 1 0;
  padding: 9mm 15mm 11mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7em;
  background: var(--paper);
  color: var(--ink);
  text-align: center;
}

.cover-org {
  font-family: var(--font);
  font-size: 1.02em;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--navy-900);
}

.cover-org[contenteditable]:empty::before {
  content: "발행 부서";
  color: var(--line-strong);
}

.cover-imprint {
  display: flex;
  align-items: center;
  gap: 0.9em;
  font-size: 0.8em;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.cover-imprint .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--line-strong);
}

.cover-imprint .v[contenteditable]:empty::before {
  content: "—";
  color: var(--line-strong);
}

/* ——— 차례 ——— */
.toc-head {
  text-align: center;
  margin-bottom: 8mm;
  padding-bottom: 5mm;
  border-bottom: 1px solid var(--line);
}

.toc-head .pg-title {
  font-family: var(--font-serif);
  font-size: 1.85em;
  letter-spacing: 0.5em;
  text-indent: 0.5em;
  font-weight: 600;
}

.toc-head .kicker {
  margin: 0.7em 0 0;
  color: var(--muted);
  letter-spacing: 0.3em;
  font-size: 0.66em;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  justify-content: flex-start;
}

.toc-ch {
  display: flex;
  align-items: baseline;
  gap: 0.7em;
  margin-top: 1.1em;
  padding-bottom: 0.35em;
  font-family: var(--font);
  font-weight: 700;
  color: var(--navy-900);
  font-size: 1.02em;
}

.toc-ch:first-child {
  margin-top: 0;
}

.toc-ch .no {
  color: var(--gold);
  font-size: 0.76em;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.toc-row {
  display: flex;
  align-items: baseline;
  gap: 0.3em;
  padding: 0.42em 0 0.42em 1.2em;
  font-size: 0.94em;
  color: var(--ink-2);
}

.toc-row .dots {
  flex: 1;
  border-bottom: 1px dotted var(--line-strong);
  height: 0.62em;
  margin: 0 0.4em;
}

.toc-row .num {
  font-variant-numeric: tabular-nums;
  font-size: 0.88em;
  color: var(--muted);
  min-width: 1.6em;
  text-align: right;
}

/* ——— 장 표지 ——— */
.chapter-page .page-inner {
  padding-top: 30mm;
  align-items: center;
  text-align: center;
}

.ch-mark {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.45em;
  font-family: var(--font-serif);
  color: var(--gold-soft);
  margin-bottom: 7mm;
}

.ch-mark .k {
  font-size: 1.05em;
  letter-spacing: 0.1em;
}

.ch-no {
  font-size: 2.4em;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.ch-rule {
  width: 16mm;
  height: 1px;
  background: rgba(201, 173, 110, 0.55);
  margin: 0 0 7mm;
}

.ch-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 2.05em;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.35;
  max-width: 95%;
}

.ch-sub {
  margin: 1em 0 0;
  color: #b9c7d6;
  font-size: 0.95em;
  line-height: 1.65;
  max-width: 85%;
}

.learn-box {
  margin-top: auto;
  padding-top: 8mm;
  width: 100%;
  text-align: left;
}

.learn-label {
  font-family: var(--font);
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--gold-soft);
  margin-bottom: 0.9em;
  text-align: center;
}

.learn-items {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.learn-item {
  display: flex;
  gap: 0.8em;
  align-items: flex-start;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  padding: 0.6em 0.2em;
}

.learn-item:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.learn-item .n {
  font-family: var(--font);
  font-weight: 700;
  color: var(--gold-soft);
  font-variant-numeric: tabular-nums;
  min-width: 1.6em;
  font-size: 0.82em;
  padding-top: 0.18em;
}

.learn-item .t {
  font-size: 0.95em;
  line-height: 1.55;
}

/* ——— POINT — 본문 위의 인용 띠 ——— */
.point-bar {
  display: block;
  background: transparent;
  border: 0;
  border-left: 3px solid var(--gold);
  padding-left: 1em;
}

.point-bar .tag {
  font-family: var(--font);
  font-size: 0.66em;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--gold);
  margin-bottom: 0.4em;
}

.point-bar .txt {
  font-size: 1.12em;
  font-weight: 600;
  line-height: 1.6;
  color: var(--navy-900);
  letter-spacing: -0.01em;
}

.is-navy .point-bar .txt {
  color: #eef3f8;
}

/* ——— 상자(TIP·주의·사례) — 종이에 얹은 옅은 면 ——— */
.callout {
  display: block;
  border: 1px solid var(--line);
  border-left: 3px solid var(--line-strong);
  background: #fff;
  padding: 0.85em 1.05em;
}

.callout .side {
  font-family: var(--font);
  font-size: 0.68em;
  font-weight: 700;
  letter-spacing: 0.16em;
  margin-bottom: 0.5em;
  color: var(--ink-2);
}

.callout .body {
  font-size: 0.95em;
  line-height: 1.68;
  color: var(--ink);
}

.callout.is-tip { background: var(--tip-bg); border-color: #dde7dd; border-left-color: var(--tip-fg); }
.callout.is-tip .side { color: var(--tip-fg); }

.callout.is-warning { background: var(--warn-bg); border-color: #ecdcc8; border-left-color: var(--warn-fg); }
.callout.is-warning .side { color: var(--warn-fg); }

.callout.is-law { background: var(--law-bg); border-color: #e4d9bf; border-left-color: var(--law-fg); }
.callout.is-law .side { color: var(--law-fg); }

.callout.is-example { background: var(--example-bg); border-color: #ddd5e4; border-left-color: var(--example-fg); }
.callout.is-example .side { color: var(--example-fg); }

.callout.is-summary { background: var(--paper-2); border-color: var(--line); border-left-color: var(--navy-900); }
.callout.is-summary .side { color: var(--navy-900); }

/* ——— 한줄 요약 ——— */
.summary-ribbon {
  display: block;
  background: var(--paper-2);
  border-top: 2px solid var(--navy-900);
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  padding: 0.8em 0 0.9em;
  text-align: center;
}

.summary-ribbon .tag {
  font-family: var(--font);
  font-size: 0.66em;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--gold);
  margin-bottom: 0.45em;
}

.summary-ribbon .txt {
  font-size: 1.02em;
  font-weight: 600;
  line-height: 1.6;
  color: var(--navy-900);
}

/* ——— 순서(흐름) ——— */
.flow {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1 0 auto;
  justify-content: flex-start;
  min-height: min-content;
}

.flow-step {
  display: grid;
  grid-template-columns: 1.9em 1fr;
  gap: 0.9em;
  position: relative;
  flex: 1 0 auto;
  min-height: min-content;
  align-items: start;
}

.flow-rail {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-dot {
  width: 1.75em;
  height: 1.75em;
  border-radius: 50%;
  border: 1px solid var(--navy-800);
  background: var(--paper);
  color: var(--navy-800);
  font-family: var(--font);
  font-size: 0.72em;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  flex-shrink: 0;
  margin-top: 0.25em;
}

.flow-step:last-child .flow-dot {
  background: var(--navy-900);
  border-color: var(--navy-900);
  color: var(--gold-soft);
}

.flow-rail::after {
  content: "";
  position: absolute;
  top: 1.6em;
  bottom: 0;
  width: 1px;
  background: var(--line-strong);
}

.flow-step:last-child .flow-rail::after {
  display: none;
}

.flow-card {
  padding: 0 0 0.9em;
  margin-bottom: 0;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: min-content;
  overflow: hidden;
}

.flow-card .lab {
  font-family: var(--font);
  font-size: 0.8em;
  font-weight: 700;
  color: var(--navy-800);
  margin-bottom: 0.25em;
}

.flow-step:last-child .flow-card .lab {
  color: var(--gold);
}

.flow-card .txt {
  font-size: 0.93em;
  line-height: 1.62;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

/* ——— 해야 할 것 / 하면 안 되는 것 ——— */
.dodont {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8em;
  flex: 1 0 auto;
  min-height: min-content;
}

.col-do,
.col-dont {
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  min-height: min-content;
}

.col-do { background: var(--do-bg); }
.col-dont { background: var(--dont-bg); }

.col-head {
  padding: 0.55em 0.8em;
  font-family: var(--font);
  font-size: 0.78em;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #fff;
}

.col-do .col-head { background: var(--do-fg); }
.col-dont .col-head { background: var(--dont-fg); }

.col-body {
  padding: 0.7em 0.85em 0.9em;
  flex: 1;
}

.col-body li {
  font-size: 0.92em;
  line-height: 1.6;
  margin: 0.45em 0;
}

.col-body ul {
  margin: 0;
  padding-left: 1.05em;
}

/* ——— 점검표 ——— */
.check-group {
  margin-bottom: 0;
  border: 1px solid var(--line);
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  min-height: min-content;
  background: #fff;
}

.page-body .blk {
  display: flex;
  flex-direction: column;
  min-height: min-content;
}

.check-group h3 {
  margin: 0;
  padding: 0.5em 0.85em;
  background: var(--navy-900);
  color: #fff;
  font-family: var(--font);
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.check-group ul {
  list-style: none;
  margin: 0;
  padding: 0.3em 0.8em 0.6em;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.check-group li {
  display: flex;
  gap: 0.6em;
  align-items: flex-start;
  padding: 0.42em 0.2em;
  border-bottom: 1px solid var(--line-soft);
  font-size: 0.93em;
  line-height: 1.5;
}

.check-group li:last-child {
  border-bottom: 0;
}

.box {
  width: 0.9em;
  height: 0.9em;
  border: 1px solid var(--navy-700);
  border-radius: 1px;
  flex-shrink: 0;
  margin-top: 0.35em;
  background: #fff;
}

.check-group li.is-checked .box {
  background: var(--navy-900);
  box-shadow: inset 0 0 0 2px #fff;
}

/* ——— 법령 ——— */
.law-card {
  border: 1px solid var(--law-line);
  border-width: 2px 0 1px;
  background: transparent;
  padding: 0.8em 0 0.9em;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  min-height: min-content;
}

.law-name {
  font-family: var(--font);
  font-size: 0.95em;
  font-weight: 700;
  color: var(--law-fg);
  margin-bottom: 0.7em;
}

.law-grid {
  display: grid;
  gap: 0.55em;
  flex: 1;
}

.law-cell {
  background: var(--law-bg);
  border: 0;
  border-left: 2px solid rgba(184, 160, 106, 0.6);
  padding: 0.5em 0.75em;
}

.law-cell .lab {
  font-family: var(--font);
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--law-fg);
  margin-bottom: 0.25em;
}

.law-cell .txt {
  font-size: 0.92em;
  line-height: 1.6;
}

.law-original {
  margin-top: 0.6em;
  border: 1px dashed var(--line-strong);
  background: #fff;
}

.law-original summary {
  cursor: pointer;
  padding: 0.5em 0.7em;
  font-family: var(--font);
  font-size: 0.78em;
  font-weight: 600;
  color: var(--law-fg);
  list-style: none;
}

.law-original summary::-webkit-details-marker {
  display: none;
}

.law-original .orig {
  padding: 0 0.7em 0.7em;
  font-size: 0.84em;
  line-height: 1.7;
  color: var(--ink-2);
  white-space: pre-wrap;
}

/* ——— 기억할 것 ——— */
.remember-head {
  text-align: center;
  padding-bottom: 4mm;
  margin-bottom: 6mm;
  border-bottom: 1px solid var(--line);
}

.remember-head .kicker {
  color: var(--gold);
  letter-spacing: 0.28em;
}

.remember-head .pg-title {
  font-family: var(--font-serif);
}

.remember-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  justify-content: flex-start;
}

.remember-item {
  display: grid;
  grid-template-columns: 2.4em 1fr;
  gap: 0.4em;
  align-items: start;
  border-bottom: 1px solid var(--line-soft);
  padding: 0.75em 0;
}

.remember-item:first-child {
  border-top: 1px solid var(--line-soft);
}

.remember-item .n {
  font-family: var(--font-serif);
  color: var(--gold);
  font-size: 1.05em;
  font-variant-numeric: tabular-nums;
  padding-top: 0.05em;
}

.remember-item .t {
  font-size: 1em;
  line-height: 1.65;
  color: var(--ink);
}

/* ——— 그림 ——— */
.img-block {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
}

.img-block img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background: var(--paper-2);
  border: 1px solid var(--line);
}

.img-block .cap {
  font-size: 0.8em;
  color: var(--muted);
  text-align: center;
}

.img-ph {
  height: 40mm;
  border: 1px dashed var(--line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 0.85em;
  background: var(--paper-2);
}

/* ——— 인용 ——— */
.quote-block {
  margin: 0;
  padding: 0.3em 1.4em;
  border: 0;
  background: transparent;
  font-size: 1.02em;
  line-height: 1.7;
  color: var(--navy-800);
  font-style: italic;
  text-align: center;
  position: relative;
}

.quote-block::before {
  content: "“";
  display: block;
  font-size: 1.8em;
  line-height: 0.6;
  color: var(--gold-soft);
  margin-bottom: 0.18em;
}

.content-stack {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.edit-list {
  margin: 0;
  padding-left: 1.1em;
}

.col-body .edit-list {
  list-style: disc;
}

.edit-list > li {
  position: relative;
}

.page-type-chip {
  position: absolute;
  top: 6px;
  right: 10px;
  font-family: var(--font);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--line-strong);
  pointer-events: none;
}

body.is-preview .page-type-chip,
body.is-preview .blk-tools {
  display: none !important;
}

.p-block,
.point-bar .txt,
.callout .body,
.summary-ribbon .txt,
.h-block,
.flow-card .txt {
  white-space: pre-wrap;
}


/* PDF / 인쇄: 크롬 숨기고 책 판형(신국판) 한 쪽씩 분리 */

@page {
  size: 152mm 225mm;
  margin: 0;
}

@media print {
  html,
  body {
    background: #fff !important;
    height: auto !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  #app {
    display: none !important;
  }

  #print-root {
    display: block !important;
    position: static !important;
    width: auto !important;
    height: auto !important;
  }

  #print-root .ebook-page {
    width: var(--page-w);
    height: var(--page-h);
    max-height: var(--page-h);
    box-shadow: none !important;
    margin: 0;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    break-inside: avoid;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  #print-root .ebook-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .blk-tools,
  .page-type-chip,
  .toolbar,
  .nav-pane,
  .inspector-pane,
  .modal-backdrop,
  #toast,
  .drop-overlay {
    display: none !important;
  }

  [contenteditable="true"],
  [contenteditable="plaintext-only"] {
    box-shadow: none !important;
    background: transparent !important;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
}

#print-root {
  display: none;
}
`;
})(typeof window !== "undefined" ? window : global);
