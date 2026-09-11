/* 자동 생성: node tests/build-css.js */
(function(g){g.EB=g.EB||{};g.EB.EXPORT_CSS = `/* 경찰 교육 전자책 — 디자인 토큰
   외부 폰트/CDN 없이 시스템 한글 폰트 fallback */
:root {
  --navy-950: #071221;
  --navy-900: #0b1f3a;
  --navy-800: #123052;
  --navy-700: #1b4270;
  --navy-600: #24608f;
  --blue-500: #2e6aa6;
  --blue-400: #4a86c1;
  --blue-100: #e7f0f8;
  --gold: #b8963e;
  --gold-soft: #d4bc6a;

  --ink: #1c2430;
  --ink-2: #3a4556;
  --muted: #6b7687;
  --line: #e2e6ec;
  --line-strong: #c5ced8;

  --paper: #ffffff;
  --canvas: #dfe7ee;
  --sidebar: #f4f7fa;
  --chrome: #0b1f3a;

  --point-bg: #eef4fa;
  --point-fg: #123052;
  --tip-bg: #ebf7f2;
  --tip-fg: #0b6b4f;
  --tip-line: #1a9a72;
  --warn-bg: #fff3eb;
  --warn-fg: #c2410c;
  --warn-line: #e8590c;
  --law-bg: #f4f0e8;
  --law-fg: #5c4a1f;
  --law-line: #8a7340;
  --example-bg: #f3eef8;
  --example-fg: #5b3d8f;
  --do-bg: #e9f6ee;
  --do-fg: #146c3a;
  --dont-bg: #fdecec;
  --dont-fg: #b42318;
  --summary-bg: #0b1f3a;

  --danger: #b42318;
  --ok: #0b6b4f;

  --font: "Pretendard", "Pretendard Variable", "Noto Sans KR",
    "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif;
  --font-mono: "Cascadia Code", "D2Coding", "Consolas", monospace;

  --fs-cover: 48px;
  --fs-chapter: 42px;
  --fs-h1: 34px;
  --fs-h2: 22px;
  --fs-body: 17.5px;
  --fs-sm: 15px;
  --fs-caption: 13px;
  --fs-label: 13px;

  --lh-tight: 1.28;
  --lh-body: 1.65;
  --radius: 2px;
  --shadow-page: 0 18px 50px rgba(11, 31, 58, 0.18), 0 2px 8px rgba(11, 31, 58, 0.08);

  --page-w: 210mm;
  --page-h: 297mm;
  --page-pad-x: 14mm;
  --page-pad-y: 12mm;

  --toolbar-h: 56px;
  --nav-w: 268px;
  --ins-w: 292px;
}


/* 전자책 페이지 템플릿 — 화면·인쇄 공통 */

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
  font-family: var(--font);
}

.page-inner {
  flex: 1 1 0;
  padding: var(--page-pad-y) var(--page-pad-x) 5mm;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.page-head {
  flex: 0 0 auto;
  padding-bottom: 5mm;
  margin-bottom: 5mm;
  border-bottom: 2.5px solid var(--navy-900);
}

.page-head .point-bar {
  margin: 5mm 0 0;
}

.page-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 5mm;
  min-height: 0;
  justify-content: space-evenly;
}

.page-body:has(.flow),
.page-body:has(.dodont),
.page-body:has(.law-card),
.page-body:has(.check-group) {
  justify-content: stretch;
  gap: 4mm;
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

.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--page-pad-x) 7mm;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--muted);
  flex: 0 0 auto;
}

.page-footer .brand-mini {
  text-transform: uppercase;
  font-weight: 700;
}

.page-footer .pg-num {
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  color: var(--navy-800);
}

.ebook-page.is-navy {
  background: var(--navy-900);
  color: #eef3f8;
}

.ebook-page.is-navy .page-footer {
  color: #8fa3b8;
}

.ebook-page.is-navy .page-footer .pg-num {
  color: var(--gold-soft);
}

.ebook-page.is-mist {
  background: #eef2f6;
}

.ebook-page.is-cover {
  background: #fff;
}

/* 공통 타이포 */
.kicker {
  font-size: var(--fs-label);
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--blue-500);
  margin-bottom: 6px;
}

.pg-title {
  margin: 0;
  font-size: var(--fs-h1);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: var(--lh-tight);
  color: var(--navy-900);
}

.pg-title.size-sm { font-size: 28px; }
.pg-title.size-lg { font-size: 40px; }

.pg-sub {
  margin: 8px 0 0;
  font-size: 16px;
  color: var(--ink-2);
  font-weight: 500;
}

.blk + .blk {
  margin-top: 0;
}

.blk.learn-box {
  margin-top: auto;
}

.h-block {
  margin: 0;
  font-size: var(--fs-h2);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--navy-800);
  line-height: 1.35;
}

.h-block.lv3 {
  font-size: 18px;
  font-weight: 700;
}

.p-block {
  margin: 0;
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--ink);
}

.bullets {
  margin: 0;
  padding-left: 1.2em;
}

.bullets li {
  font-size: var(--fs-body);
  line-height: 1.7;
  margin: 8px 0;
}

/* ——— COVER ——— */
.cover-top {
  background: linear-gradient(165deg, var(--navy-800) 0%, var(--navy-950) 70%);
  color: #fff;
  padding: 18mm 16mm 14mm;
  position: relative;
  overflow: hidden;
  flex: 1.35 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.cover-top::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      -18deg,
      transparent 0 18px,
      rgba(255, 255, 255, 0.018) 18px 19px
    );
  pointer-events: none;
}

.cover-top::after {
  content: "";
  position: absolute;
  right: -30mm;
  top: -20mm;
  width: 140mm;
  height: 140mm;
  border: 1px solid rgba(212, 188, 106, 0.22);
  transform: rotate(18deg);
  pointer-events: none;
}

.cover-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  border: 1px solid rgba(212, 188, 106, 0.55);
  color: var(--gold-soft);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 7px 12px;
  z-index: 1;
}

.cover-mark {
  width: 48px;
  height: 48px;
  color: var(--gold-soft);
  margin: auto 0 8mm;
  z-index: 1;
}

.cover-kicker {
  z-index: 1;
  font-size: 13px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #9bb8d3;
  font-weight: 700;
  margin-bottom: 10px;
}

.cover-title {
  z-index: 1;
  margin: 0;
  font-size: var(--fs-cover);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.2;
  max-width: 170mm;
}

.cover-sub {
  z-index: 1;
  margin: 12px 0 0;
  font-size: 18px;
  color: #c5d4e4;
  font-weight: 500;
  max-width: 160mm;
  line-height: 1.45;
}

.cover-bottom {
  flex: 0.85 1 0;
  padding: 10mm 16mm 12mm;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 28px;
  align-content: center;
  background: #fff;
  color: var(--ink);
}

.meta-cell .k {
  display: block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 5px;
}

.meta-cell .v {
  font-size: 16.5px;
  font-weight: 700;
  color: var(--navy-900);
}

.cover-rule {
  height: 4px;
  background: var(--gold);
  border: 0;
  margin: 0;
}

/* ——— TOC ——— */
.toc-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 6mm;
  padding-bottom: 4mm;
  border-bottom: 2.5px solid var(--navy-900);
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  justify-content: space-evenly;
}

.toc-ch {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 6px;
  padding: 8px 0 4px;
  font-weight: 800;
  color: var(--navy-900);
  font-size: 17px;
}

.toc-ch .no {
  color: var(--gold);
  font-size: 13px;
  letter-spacing: 0.12em;
  min-width: 78px;
}

.toc-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 7px 0 7px 18px;
  font-size: 16px;
  color: var(--ink-2);
}

.toc-row .dots {
  flex: 1;
  border-bottom: 1px dotted #c5ced8;
  height: 0.7em;
  margin: 0 6px;
}

.toc-row .num {
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  font-weight: 700;
  color: var(--muted);
  min-width: 26px;
  text-align: right;
}

/* ——— CHAPTER ——— */
.chapter-page .page-inner {
  padding-top: 14mm;
}

.ch-index {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: var(--gold-soft);
  margin-bottom: 6mm;
}

.ch-no {
  font-size: 88px;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 0.85;
  color: #fff;
  margin: 0 0 8mm;
}

.ch-title {
  margin: 0;
  font-size: var(--fs-chapter);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.22;
  max-width: 170mm;
}

.ch-sub {
  margin: 12px 0 0;
  color: #b7c7d8;
  font-size: 18px;
}

.learn-box {
  margin-top: auto;
  padding-top: 8mm;
}

.learn-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-soft);
  margin-bottom: 10px;
}

.learn-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.learn-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.06);
  border-left: 3px solid var(--gold);
  padding: 12px 14px;
}

.learn-item .n {
  font-weight: 800;
  color: var(--gold-soft);
  font-variant-numeric: tabular-nums;
  min-width: 1.5em;
  font-size: 16px;
}

.learn-item .t {
  font-size: 17px;
  line-height: 1.45;
}

/* ——— POINT ——— */
.point-bar {
  display: flex;
  gap: 0;
  align-items: stretch;
  background: var(--point-bg);
  border: 1px solid #d5e3f0;
}

.point-bar .tag {
  flex-shrink: 0;
  width: 32px;
  background: var(--navy-900);
  color: #fff;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.point-bar .txt {
  padding: 14px 16px;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.45;
  color: var(--navy-900);
  letter-spacing: -0.02em;
}

/* Callouts */
.callout {
  display: grid;
  grid-template-columns: 72px 1fr;
  border: 1px solid var(--line);
  background: #fff;
}

.callout .side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 6px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #fff;
}

.callout .body {
  padding: 14px 16px;
  font-size: 16.5px;
  line-height: 1.6;
  color: var(--ink);
}

.callout.is-tip .side { background: var(--tip-fg); }
.callout.is-tip { background: var(--tip-bg); border-color: #c8eadc; }

.callout.is-warning .side { background: var(--warn-fg); }
.callout.is-warning { background: var(--warn-bg); border-color: #f6d0b4; }

.callout.is-law .side { background: var(--law-fg); }
.callout.is-law { background: var(--law-bg); border-color: #e2d6be; }

.callout.is-example .side { background: var(--example-fg); }
.callout.is-example { background: var(--example-bg); border-color: #ddd0ee; }

.callout.is-summary .side { background: var(--navy-900); }
.callout.is-summary { background: #f2f5f8; border-color: #d3dce6; }

.callout .side .ico {
  width: 16px;
  height: 16px;
}

.summary-ribbon {
  background: var(--summary-bg);
  color: #fff;
  display: grid;
  grid-template-columns: 88px 1fr;
  min-height: 22mm;
}

.summary-ribbon .tag {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gold);
  color: var(--navy-950);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.summary-ribbon .txt {
  padding: 14px 16px;
  font-size: 17.5px;
  font-weight: 700;
  line-height: 1.45;
  display: flex;
  align-items: center;
}

/* ——— CASE FLOW ——— */
.flow {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 4px;
  flex: 1 0 auto;
  justify-content: flex-start;
  min-height: min-content;
}

.flow-step {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 12px;
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
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--navy-900);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  flex-shrink: 0;
}

.flow-step:last-child .flow-dot {
  background: var(--gold);
  color: var(--navy-950);
}

.flow-rail::after {
  content: "";
  position: absolute;
  top: 26px;
  bottom: -4px;
  width: 2px;
  background: #d5deea;
}

.flow-step:last-child .flow-rail::after {
  display: none;
}

.flow-card {
  background: #fff;
  border: 1px solid var(--line);
  padding: 8px 14px 10px;
  margin-bottom: 0;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: min-content;
  overflow: hidden;
}

.flow-card .lab {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blue-500);
  margin-bottom: 4px;
}

.flow-step:last-child .flow-card {
  background: var(--navy-900);
  border-color: var(--navy-900);
  color: #fff;
}

.flow-step:last-child .flow-card .lab {
  color: var(--gold-soft);
}

.flow-card .txt {
  font-size: 15.5px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

/* ——— DO / DON'T ——— */
.dodont {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #fff;
}

.col-do .col-head { background: var(--do-fg); }
.col-dont .col-head { background: var(--dont-fg); }

.col-body {
  padding: 12px 14px 16px;
  flex: 1;
}

.col-body li {
  font-size: 16px;
  line-height: 1.55;
  margin: 8px 0;
}

.col-body ul {
  margin: 0;
  padding-left: 1.15em;
}

/* ——— CHECKLIST ——— */
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
  padding: 8px 14px;
  background: var(--navy-900);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.check-group ul {
  list-style: none;
  margin: 0;
  padding: 6px 12px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.check-group li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 7px 4px;
  border-bottom: 1px solid #eef1f5;
  font-size: 15.5px;
  line-height: 1.45;
}

.check-group li:last-child {
  border-bottom: 0;
}

.box {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--navy-700);
  border-radius: 2px;
  flex-shrink: 0;
  margin-top: 3px;
  background: #fff;
}

.check-group li.is-checked .box {
  background: var(--navy-900);
  box-shadow: inset 0 0 0 2px #fff;
}

/* ——— LAW ——— */
.law-card {
  border: 1px solid #e2d6be;
  background: var(--law-bg);
  padding: 14px 16px;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  min-height: min-content;
}

.law-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--law-fg);
  margin-bottom: 10px;
}

.law-grid {
  display: grid;
  gap: 8px;
  flex: 1;
}

.law-cell {
  background: #fff;
  border: 1px solid #eadfcb;
  padding: 10px 12px;
}

.law-cell .lab {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--law-fg);
  margin-bottom: 4px;
}

.law-cell .txt {
  font-size: 15.5px;
  line-height: 1.55;
}

.law-original {
  margin-top: 8px;
  border: 1px dashed #cbb98a;
  background: #fff;
}

.law-original summary {
  cursor: pointer;
  padding: 8px 10px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--law-fg);
  list-style: none;
}

.law-original summary::-webkit-details-marker {
  display: none;
}

.law-original .orig {
  padding: 0 10px 10px;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--ink-2);
  white-space: pre-wrap;
}

/* ——— SUMMARY PAGE ——— */
.remember-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 5mm;
  margin-bottom: 5mm;
  border-bottom: 2.5px solid var(--navy-900);
}

.remember-mark {
  width: 52px;
  height: 52px;
  background: var(--navy-900);
  color: var(--gold-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
}

.remember-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  justify-content: stretch;
}

.remember-item {
  display: grid;
  grid-template-columns: 52px 1fr;
  flex: 1;
  min-height: 0;
  border: 1px solid var(--line);
  background: #fff;
}

.remember-item .n {
  background: var(--navy-900);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.remember-item .t {
  padding: 12px 16px;
  font-size: 17px;
  font-weight: 650;
  line-height: 1.5;
  display: flex;
  align-items: center;
  background: #fff;
}

.img-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.img-block img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background: #f3f5f8;
  border: 1px solid var(--line);
}

.img-block .cap {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}

.img-ph {
  height: 48mm;
  border: 1.5px dashed var(--line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 14px;
  background: #fafbfc;
}

.quote-block {
  margin: 0;
  padding: 12px 16px;
  border-left: 4px solid var(--gold);
  background: #faf7f0;
  font-size: 17px;
  line-height: 1.55;
  color: var(--navy-800);
  font-weight: 600;
}

.content-stack {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.edit-list {
  margin: 0;
  padding-left: 1.2em;
}

.col-body .edit-list {
  list-style: disc;
}

.edit-list > li {
  position: relative;
}

.process {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  flex: 1;
}

.process-step {
  border: 1px solid var(--line);
  padding: 12px;
  background: #fff;
}

.process-step .n {
  font-size: 12px;
  font-weight: 800;
  color: var(--blue-500);
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.process-step .t {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.page-type-chip {
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #8fa3b8;
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


/* PDF / 인쇄: 크롬 숨기고 A4 페이지 단위로 분리 */

@page {
  size: A4;
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
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
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
