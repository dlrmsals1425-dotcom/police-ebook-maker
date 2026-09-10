/* Markdown → 전자책 / 전자책 → Markdown
   외부 라이브러리 없이 UTF-8 텍스트만 처리한다. */
(function (g) {
  const EB = (g.EB = g.EB || {});
  const MAX_WEIGHT = 28;
  const CALLOUT_TYPES = ["point", "tip", "warning", "law", "example", "summary"];

  function trim(s) {
    return String(s || "").replace(/\s+$/, "").replace(/^\s+/, "");
  }

  function extractFrontmatter(src) {
    const text = EB.stripBom(src).replace(/\r\n/g, "\n");
    const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!m) return { meta: {}, body: text };
    const meta = {};
    m[1].split("\n").forEach(function (line) {
      const i = line.indexOf(":");
      if (i < 1) return;
      const key = trim(line.slice(0, i)).toLowerCase();
      const val = trim(line.slice(i + 1)).replace(/^["']|["']$/g, "");
      const map = {
        title: "title",
        subtitle: "subtitle",
        부제: "subtitle",
        category: "category",
        분류: "category",
        department: "department",
        제작부서: "department",
        date: "date",
        제작일: "date",
        version: "version",
        버전: "version"
      };
      if (map[key]) meta[map[key]] = val;
    });
    return { meta: meta, body: text.slice(m[0].length) };
  }

  function parseCalloutFirstLine(raw) {
    const line = raw.replace(/^>\s?/, "");
    const m = line.match(/^(point|tip|warning|law|example|summary)\s*[:：]\s*(.*)$/i);
    if (m) {
      return { type: m[1].toLowerCase(), rest: m[2] };
    }
    return { type: null, rest: line };
  }

  function tokenize(body) {
    const lines = String(body || "").replace(/\r\n/g, "\n").split("\n");
    const tokens = [];
    let i = 0;

    function collectQuotes() {
      const groups = [];
      let current = null;
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        const raw = lines[i].replace(/^>\s?/, "");
        const parsed = parseCalloutFirstLine(">" + raw);
        if (parsed.type) {
          if (current) groups.push(current);
          current = { type: "callout", callout: parsed.type, text: parsed.rest || "" };
        } else if (current && current.type === "callout") {
          current.text = trim(current.text + "\n" + parsed.rest);
        } else if (current && current.type === "quote") {
          current.text = trim(current.text + "\n" + parsed.rest);
        } else {
          current = { type: "quote", text: parsed.rest || "" };
        }
        i++;
      }
      if (current) groups.push(current);
      groups.forEach(function (g) {
        g.text = trim(g.text);
      });
      return groups;
    }

    function collectList() {
      const items = [];
      const ordered = /^\s*\d+[.)]\s+/.test(lines[i]);
      let checklist = false;
      while (i < lines.length) {
        const line = lines[i];
        const um = line.match(/^\s*[-*+]\s+(.*)$/);
        const om = line.match(/^\s*\d+[.)]\s+(.*)$/);
        const cm = line.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/);
        if (cm) {
          checklist = true;
          items.push({ text: trim(cm[2]), checked: /x/i.test(cm[1]) });
          i++;
          continue;
        }
        if (um && !ordered) {
          items.push(trim(um[1]));
          i++;
          continue;
        }
        if (om && ordered) {
          items.push(trim(om[1]));
          i++;
          continue;
        }
        break;
      }
      if (checklist) return { type: "checklist", items: items };
      return { type: ordered ? "ol" : "ul", items: items };
    }

    function collectParagraph() {
      const buf = [];
      while (i < lines.length) {
        const line = lines[i];
        if (!trim(line)) break;
        if (/^#{1,6}\s/.test(line)) break;
        if (/^>\s?/.test(line)) break;
        if (/^\s*[-*+]\s+/.test(line)) break;
        if (/^\s*\d+[.)]\s+/.test(line)) break;
        if (/^---+$/.test(line) || /^\*\*\*+$/.test(line)) break;
        if (/^<!--/.test(line)) break;
        if (/^!\[[^\]]*\]\([^)]+\)/.test(line)) break;
        buf.push(line);
        i++;
      }
      return { type: "paragraph", text: trim(buf.join("\n").replace(/\n/g, " ")) };
    }

    while (i < lines.length) {
      const line = lines[i];
      if (!trim(line)) {
        i++;
        continue;
      }
      const hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm) {
        tokens.push({ type: "heading", level: hm[1].length, text: trim(hm[2]) });
        i++;
        continue;
      }
      const cm = line.match(/^<!--\s*page\s*:\s*([a-z]+)\s*-->/i);
      if (cm) {
        tokens.push({ type: "pagedir", pageType: cm[1].toLowerCase() });
        i++;
        continue;
      }
      if (/^<!--/.test(line)) {
        i++;
        continue;
      }
      if (/^---+$/.test(line) || /^\*\*\*+$/.test(line)) {
        tokens.push({ type: "hr" });
        i++;
        continue;
      }
      if (/^>\s?/.test(line)) {
        collectQuotes().forEach(function (q) {
          tokens.push(q);
        });
        continue;
      }
      const im = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (im) {
        tokens.push({ type: "image", alt: im[1], src: im[2] });
        i++;
        continue;
      }
      if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
        tokens.push(collectList());
        continue;
      }
      tokens.push(collectParagraph());
    }
    return tokens;
  }

  function classifySection(title) {
    const t = String(title || "").replace(/\s+/g, "").toLowerCase();
    const rules = [
      [/핵심포인트|핵심point|^point$|keypoint|핵심요점/, "point"],
      [/참고사항|현장tip|^tip$|알아두기|현장팁/, "tip"],
      [/주의사항|경고|^warning$|주의할점|주의점/, "warning"],
      [/관련법령|^법령$|^law$|조문/, "law"],
      [/현장에서는|이렇게적용/, "law-apply"],
      [/한줄요약|^요약$|^summary$|핵심요약/, "summary"],
      [/사례|^example$|예시/, "example"],
      [/체크리스트|확인사항|조치사항|보고사항|증거확보|후속조치/, "checklist"],
      [/lesson|교훈|배운점/, "lesson"],
      [/사건발생|사건개요|^개요$/, "incident"],
      [/현장상황|^상황$/, "situation"],
      [/경찰관판단|^판단$|판단내용/, "judgment"],
      [/조치내용|^조치$|대응요령|대응내용/, "action"],
      [/^결과$|처리결과/, "result"],
      [/^do$|해야할|해야\s*할/, "do"],
      [/^don'?t$|하지말|하면안/, "dont"],
      [/배울내용|학습목표|이장에서/, "learn"]
    ];
    for (let i = 0; i < rules.length; i++) {
      if (rules[i][0].test(t)) return rules[i][1];
    }
    return "generic";
  }

  function isChapterHeading(text) {
    const t = trim(text);
    return /^(CHAPTER|Chapter|챕터)\s*\d+/i.test(t) ||
      /^제\s*\d+\s*장/.test(t) ||
      /^CHAPTER\s/i.test(t);
  }

  function parseChapterHeading(text) {
    const t = trim(text);
    let no = "";
    let title = t;
    const m1 = t.match(/^(?:CHAPTER|Chapter|챕터)\s*0*(\d+)\s*[:.\-]?\s*(.*)$/i);
    if (m1) {
      no = EB.pad2(m1[1]);
      title = trim(m1[2]) || t;
      return { no: no, title: title };
    }
    const m2 = t.match(/^제\s*(\d+)\s*장\s*[:.\-]?\s*(.*)$/);
    if (m2) {
      no = EB.pad2(m2[1]);
      title = trim(m2[2]) || t;
    }
    return { no: no, title: title };
  }

  function tokenWeight(tok) {
    if (!tok) return 0;
    const len = function (s) {
      return String(s || "").length;
    };
    switch (tok.type) {
      case "heading":
        return tok.level === 1 ? 6 : tok.level === 2 ? 4 : 3;
      case "paragraph":
        return 2 + Math.ceil(len(tok.text) / 90);
      case "ul":
      case "ol":
        return 1 + (tok.items || []).length * 1.2;
      case "checklist":
        return 1.5 + (tok.items || []).length * 1.4;
      case "callout":
        return 4 + Math.ceil(len(tok.text) / 110);
      case "quote":
        return 3;
      case "image":
        return 10;
      case "hr":
        return 1;
      default:
        return 2;
    }
  }

  function blockWeight(b) {
    if (!b) return 0;
    const len = function (s) {
      return String(s || "").length;
    };
    switch (b.type) {
      case "heading":
        return b.level === 1 ? 6 : 4;
      case "paragraph":
        return 2 + Math.ceil(len(b.text) / 90);
      case "point":
        return 5;
      case "bullets":
        return 1 + (b.items || []).length * 1.2;
      case "checklist": {
        let n = 0;
        (b.groups || []).forEach(function (g) {
          n += (g.items || []).length;
        });
        return 2 + n * 1.3;
      }
      case "tip":
      case "warning":
      case "example":
        return 5 + Math.ceil(len(b.text) / 120);
      case "law":
        return 8 + Math.ceil((len(b.text) + len(b.apply) + len(b.caution)) / 140);
      case "summary":
        return 4;
      case "image":
        return 10;
      case "flow":
        return 6 + (b.items || []).length * 2;
      case "dodont":
        return 8 + ((b.doItems || []).length + (b.dontItems || []).length) * 1.1;
      case "learn":
        return 6;
      case "quote":
        return 3;
      default:
        return 2;
    }
  }

  function guessPageType(title, blocks, forced) {
    if (forced) return forced;
    const t = String(title || "");
    if (/기억하세요|핵심\s*요약|한눈에/.test(t)) return "summary";
    if (/체크리스트|확인사항/.test(t)) return "checklist";
    if (/법령|조문|매뉴얼/.test(t) && !/do|don't/i.test(t)) return "law";
    if (/don't|하지\s*말|do\s*\/\s*don/i.test(t)) return "dodont";
    const types = {};
    (blocks || []).forEach(function (b) {
      types[b.type] = (types[b.type] || 0) + 1;
    });
    if (types.flow) return "case";
    if (types.dodont) return "dodont";
    if (types.checklist && !types.point && !types.flow) return "checklist";
    if (types.law && !types.flow && !types.dodont && !types.point && Object.keys(types).length <= 3) return "law";
    if (types.bullets && /기억/.test(t)) return "summary";
    return "content";
  }

  function tokensToBlocks(contentTokens) {
    const blocks = [];
    let i = 0;
    const flowMap = { incident: 0, situation: 1, judgment: 2, action: 3, result: 4, lesson: 5 };
    const flowBag = {};
    let doItems = [];
    let dontItems = [];

    function flushFlow() {
      const keys = Object.keys(flowBag);
      if (!keys.length) return;
      const items = EB.FLOW_LABELS.map(function (label, idx) {
        return { label: label, text: flowBag[idx] || "" };
      });
      const has = items.some(function (it) {
        return trim(it.text);
      });
      if (has) blocks.push(EB.createBlock("flow", { items: items }));
      Object.keys(flowBag).forEach(function (k) {
        delete flowBag[k];
      });
    }

    function flushDoDont() {
      if (!doItems.length && !dontItems.length) return;
      blocks.push(
        EB.createBlock("dodont", {
          doItems: doItems.length ? doItems : [""],
          dontItems: dontItems.length ? dontItems : [""]
        })
      );
      doItems = [];
      dontItems = [];
    }

    function pushCallout(kind, text) {
      if (kind === "point") blocks.push(EB.createBlock("point", { text: text }));
      else if (kind === "summary") blocks.push(EB.createBlock("summary", { text: text }));
      else if (kind === "tip") blocks.push(EB.createBlock("tip", { text: text }));
      else if (kind === "warning") blocks.push(EB.createBlock("warning", { text: text }));
      else if (kind === "example") blocks.push(EB.createBlock("example", { text: text }));
      else if (kind === "law") {
        blocks.push(EB.createBlock("law", { title: "관련 법령", text: text }));
      }
    }

    function consumeSectionBody() {
      const gathered = [];
      while (i < contentTokens.length && contentTokens[i].type !== "heading") {
        if (contentTokens[i].type === "callout" && gathered.length) break;
        gathered.push(contentTokens[i]);
        i++;
      }
      return gathered;
    }

    function textFrom(gathered) {
      const parts = [];
      const items = [];
      const checks = [];
      const callouts = [];
      gathered.forEach(function (g) {
        if (g.type === "paragraph" || g.type === "quote") parts.push(g.text);
        else if (g.type === "callout") callouts.push(g);
        else if (g.type === "ul" || g.type === "ol") {
          (g.items || []).forEach(function (it) {
            items.push(typeof it === "string" ? it : it.text);
          });
        } else if (g.type === "checklist") {
          (g.items || []).forEach(function (it) {
            checks.push(it);
          });
        }
      });
      return { parts: parts, items: items, checks: checks, callouts: callouts };
    }

    function sectionText(pack) {
      return (
        pack.parts.join("\n") ||
        pack.items.join("\n") ||
        (pack.callouts[0] && pack.callouts[0].text) ||
        ""
      );
    }

    while (i < contentTokens.length) {
      const tok = contentTokens[i];
      if (tok.type === "heading") {
        const kind = classifySection(tok.text);
        i++;
        const body = consumeSectionBody();
        const pack = textFrom(body);
        const joined = sectionText(pack);

        if (kind === "point") {
          flushFlow();
          flushDoDont();
          blocks.push(EB.createBlock("point", { text: joined }));
        } else if (kind === "law-apply") {
          flushFlow();
          flushDoDont();
          (function () {
            for (let k = blocks.length - 1; k >= 0; k--) {
              if (blocks[k].type === "law") {
                blocks[k].apply = joined;
                return;
              }
            }
            blocks.push(EB.createBlock("law", { title: tok.text, apply: joined, text: "" }));
          })();
        } else if (kind === "warning") {
          flushFlow();
          flushDoDont();
          let filled = false;
          for (let k = blocks.length - 1; k >= 0; k--) {
            if (blocks[k].type === "law" && !trim(blocks[k].caution || "")) {
              blocks[k].caution = joined;
              filled = true;
              break;
            }
          }
          if (!filled) pushCallout("warning", joined);
        } else if (kind === "tip" || kind === "example" || kind === "summary") {
          flushFlow();
          flushDoDont();
          pushCallout(kind, joined);
        } else if (kind === "law") {
          flushFlow();
          flushDoDont();
          blocks.push(
            EB.createBlock("law", {
              title: tok.text,
              text: joined,
              apply: "",
              caution: ""
            })
          );
        } else if (kind === "checklist") {
          flushFlow();
          flushDoDont();
          const items = pack.checks.length
            ? pack.checks
            : pack.items.map(function (t) {
                return { text: t, checked: false };
              });
          const groups = [{ title: tok.text, items: items.length ? items : [{ text: "", checked: false }] }];
          const existing = blocks.filter(function (b) {
            return b.type === "checklist";
          })[0];
          if (existing) existing.groups = (existing.groups || []).concat(groups);
          else blocks.push(EB.createBlock("checklist", { groups: groups }));
        } else if (flowMap[kind] != null) {
          flushDoDont();
          flowBag[flowMap[kind]] = joined || pack.items.map(function (x) {
            return "· " + x;
          }).join("\n");
          if (kind === "situation" && !flowBag[0]) flowBag[0] = "";
        } else if (kind === "do") {
          flushFlow();
          doItems = doItems.concat(pack.items.length ? pack.items : joined ? [joined] : []);
        } else if (kind === "dont") {
          flushFlow();
          dontItems = dontItems.concat(pack.items.length ? pack.items : joined ? [joined] : []);
        } else if (kind === "learn") {
          flushFlow();
          flushDoDont();
          blocks.push(
            EB.createBlock("learn", {
              items: pack.items.length ? pack.items : pack.parts.slice(0, 3)
            })
          );
        } else {
          flushFlow();
          flushDoDont();
          blocks.push(EB.createBlock("heading", { text: tok.text, level: tok.level || 2 }));
          if (pack.items.length) {
            blocks.push(EB.createBlock("bullets", { items: pack.items }));
          }
          if (pack.checks.length) {
            blocks.push(
              EB.createBlock("checklist", {
                groups: [{ title: "확인", items: pack.checks }]
              })
            );
          }
          pack.parts.forEach(function (p) {
            if (trim(p)) blocks.push(EB.createBlock("paragraph", { text: p }));
          });
          body.forEach(function (g) {
            if (g.type === "callout") pushCallout(g.callout, g.text);
            if (g.type === "image") blocks.push(EB.createBlock("image", { src: g.src, alt: g.alt }));
            if (g.type === "quote" && kind === "generic") {
              /* already in parts */
            }
          });
        }
        continue;
      }

      if (tok.type === "callout") {
        flushFlow();
        flushDoDont();
        pushCallout(tok.callout, tok.text);
        i++;
        continue;
      }
      if (tok.type === "ul" || tok.type === "ol") {
        flushFlow();
        flushDoDont();
        blocks.push(EB.createBlock("bullets", { items: tok.items.slice() }));
        i++;
        continue;
      }
      if (tok.type === "checklist") {
        flushFlow();
        flushDoDont();
        blocks.push(
          EB.createBlock("checklist", {
            groups: [{ title: "확인사항", items: tok.items }]
          })
        );
        i++;
        continue;
      }
      if (tok.type === "paragraph") {
        flushFlow();
        flushDoDont();
        blocks.push(EB.createBlock("paragraph", { text: tok.text }));
        i++;
        continue;
      }
      if (tok.type === "quote") {
        flushFlow();
        flushDoDont();
        blocks.push(EB.createBlock("quote", { text: tok.text }));
        i++;
        continue;
      }
      if (tok.type === "image") {
        blocks.push(EB.createBlock("image", { src: tok.src, alt: tok.alt }));
        i++;
        continue;
      }
      i++;
    }
    flushFlow();
    flushDoDont();
    return blocks.filter(function (b) {
      if (b.type === "paragraph" && !trim(b.text)) return false;
      if (b.type === "heading" && !trim(b.text)) return false;
      return true;
    });
  }

  function paginateBlocks(title, subtitle, blocks, forcedType) {
    const pages = [];
    if (!blocks.length) {
      const p = EB.createPage(guessPageType(title, [], forcedType), title);
      p.subtitle = subtitle || "";
      p.blocks = EB.defaultBlocksFor(p.type);
      return [p];
    }

    let current = [];
    let weight = 0;
    const h2Count = { n: 0 };

    function openPage(t) {
      const page = EB.createPage(guessPageType(t, current, forcedType), t);
      page.subtitle = subtitle || "";
      page.blocks = current.slice();
      if (!page.blocks.length) page.blocks = [];
      pages.push(page);
      current = [];
      weight = 0;
      h2Count.n = 0;
    }

    function wouldOverflow(w) {
      return current.length && weight + w > MAX_WEIGHT;
    }

    blocks.forEach(function (b, idx) {
      const w = blockWeight(b);
      const isNewMessage =
        b.type === "heading" &&
        b.level <= 2 &&
        current.length &&
        (h2Count.n >= 1 || weight >= 12);

      const keepWithCase = b.type === "flow" && weight < 18;
      const keepSummary = b.type === "summary" && current.length && weight < 40;
      if ((isNewMessage || wouldOverflow(w)) && !keepWithCase && !keepSummary) {
        const t = title + (pages.length ? " (계속)" : "");
        openPage(pages.length ? t : title);
      }
      if (b.type === "heading" && b.level <= 2) h2Count.n += 1;
      current.push(b);
      weight += w;

      const hasCore =
        current.filter(function (x) {
          return x.type === "point";
        }).length &&
        current.filter(function (x) {
          return x.type === "summary";
        }).length &&
        weight >= 16;
      if (hasCore && idx < blocks.length - 1) {
        const next = blocks[idx + 1];
        if (next && (next.type === "heading" || next.type === "point" || next.type === "flow")) {
          openPage(pages.length ? title + " (계속)" : title);
        }
      }
    });

    if (current.length) openPage(pages.length ? title + " (계속)" : title);

    pages.forEach(function (p, i) {
      p.type = guessPageType(p.title, p.blocks, forcedType);
      if (p.type === "chapter") p.background = "navy";
      if (i > 0 && / \(계속\)$/.test(p.title) && p.blocks[0] && p.blocks[0].type !== "heading") {
        /* keep */
      }
    });
    return pages;
  }

  function parse(src) {
    const raw = EB.stripBom(src || "");
    if (!trim(raw)) {
      const err = new Error("EMPTY");
      err.code = "EMPTY";
      throw err;
    }
    const extracted = extractFrontmatter(raw);
    const tokens = tokenize(extracted.body);
    if (!tokens.length) {
      const err = new Error("EMPTY");
      err.code = "EMPTY";
      throw err;
    }

    const meta = {
      title: extracted.meta.title || "",
      subtitle: extracted.meta.subtitle || "",
      category: extracted.meta.category || "내부 교육자료",
      department: extracted.meta.department || "○○경찰서",
      date: extracted.meta.date || EB.today(),
      version: extracted.meta.version || "1.0"
    };

    const project = {
      id: EB.uid("book"),
      meta: meta,
      pages: [],
      updatedAt: Date.now()
    };

    let forcedType = null;
    let chapterSeq = 0;
    let i = 0;
    let firstH1UsedAsTitle = false;

    if (!meta.title) {
      const firstH1 = tokens.filter(function (t) {
        return t.type === "heading" && t.level === 1;
      })[0];
      if (firstH1 && !isChapterHeading(firstH1.text)) {
        meta.title = firstH1.text;
        firstH1UsedAsTitle = true;
      } else if (firstH1) {
        meta.title = firstH1.text.replace(/^(CHAPTER|챕터|제\s*\d+\s*장)[^가-힣A-Za-z]*/i, "");
        meta.title = trim(meta.title) || firstH1.text;
      } else {
        meta.title = "교육 전자책";
      }
    }

    const cover = EB.createPage("cover", meta.title);
    const toc = EB.createPage("toc", "목차");
    project.pages.push(cover, toc);

    function takeUntilNextH1(start) {
      const slice = [];
      let k = start;
      while (k < tokens.length) {
        const t = tokens[k];
        if (k !== start && t.type === "heading" && t.level === 1) break;
        if (t.type === "pagedir") {
          k++;
          continue;
        }
        if (t.type === "hr") {
          k++;
          break;
        }
        slice.push(t);
        k++;
      }
      return { slice: slice, next: k };
    }

    const h1s = [];
    tokens.forEach(function (t, idx) {
      if (t.type === "heading" && t.level === 1) h1s.push({ idx: idx, text: t.text });
    });

    if (!h1s.length) {
      const blocks = tokensToBlocks(tokens);
      const pages = paginateBlocks(meta.title, meta.subtitle, blocks, forcedType);
      project.pages = project.pages.concat(pages);
      return project;
    }

    h1s.forEach(function (h, hi) {
      const start = h.idx;
      forcedType = null;
      if (start > 0 && tokens[start - 1].type === "pagedir") {
        forcedType = tokens[start - 1].pageType;
      }
      const grabbed = takeUntilNextH1(start);
      const group = grabbed.slice;
      const heading = group[0];
      const rest = group.slice(1);
      const titleText = heading.text;
      const skipAsPage = firstH1UsedAsTitle && hi === 0 && !isChapterHeading(titleText);
      if (skipAsPage && !rest.length) {
        forcedType = null;
        return;
      }

      if (isChapterHeading(titleText)) {
        chapterSeq += 1;
        const parsed = parseChapterHeading(titleText);
        const ch = EB.createPage("chapter", parsed.title);
        ch.chapterNo = parsed.no || EB.pad2(chapterSeq);
        ch.background = "navy";
        const learnTok = rest.filter(function (t) {
          return t.type === "ul" || t.type === "ol";
        })[0];
        const learnItems = learnTok
          ? learnTok.items.slice(0, 4)
          : rest
              .filter(function (t) {
                return t.type === "paragraph";
              })
              .slice(0, 3)
              .map(function (t) {
                return t.text;
              });
        if (learnItems && learnItems.length) {
          ch.blocks = [EB.createBlock("learn", { items: learnItems })];
        } else {
          ch.blocks = EB.defaultBlocksFor("chapter");
        }
        project.pages.push(ch);
        const leftover = rest.filter(function (t) {
          if (learnTok && t === learnTok) return false;
          if (t.type === "heading") return true;
          if (t.type === "paragraph" && learnItems && learnItems.indexOf(t.text) !== -1) return false;
          return t.type !== "ul" && t.type !== "ol";
        });
        if (leftover.length) {
          const blocks = tokensToBlocks(leftover);
          paginateBlocks(parsed.title, "", blocks, forcedType).forEach(function (p) {
            if (p.blocks.length) project.pages.push(p);
          });
        }
        forcedType = null;
        return;
      }

      const blocks = tokensToBlocks(rest);
      const pages = paginateBlocks(skipAsPage ? meta.title : titleText, "", blocks, forcedType);
      pages.forEach(function (p) {
        project.pages.push(p);
      });
      forcedType = null;
    });

    if (project.pages.length <= 2) {
      const extra = EB.createPage("content", meta.title);
      extra.blocks = EB.defaultBlocksFor("content");
      project.pages.push(extra);
    }
    return project;
  }

  function listToMd(items, ordered) {
    return (items || [])
      .map(function (it, i) {
        const text = typeof it === "string" ? it : it.text;
        if (ordered) return i + 1 + ". " + text;
        if (it && typeof it === "object" && "checked" in it) {
          return "- [" + (it.checked ? "x" : " ") + "] " + (it.text || "");
        }
        return "- " + text;
      })
      .join("\n");
  }

  function blockToMd(b) {
    switch (b.type) {
      case "heading":
        return Array((b.level || 2) + 1).join("#") + " " + (b.text || "");
      case "paragraph":
        return b.text || "";
      case "point":
        return "> point: " + (b.text || "");
      case "tip":
        return "> tip: " + (b.text || "");
      case "warning":
        return "> warning: " + (b.text || "");
      case "example":
        return "> example: " + (b.text || "");
      case "summary":
        return "> summary: " + (b.text || "");
      case "quote":
        return "> " + String(b.text || "").replace(/\n/g, "\n> ");
      case "bullets":
        return listToMd(b.items || [], false);
      case "learn":
        return "## 배울 내용\n" + listToMd(b.items || [], false);
      case "checklist":
        return (b.groups || [])
          .map(function (g) {
            return "## " + g.title + "\n" + listToMd(g.items || [], false);
          })
          .join("\n\n");
      case "law":
        return (
          "> law: " +
          (b.title ? b.title + " — " : "") +
          (b.text || "") +
          (b.apply ? "\n\n## 현장에서는 이렇게 적용\n" + b.apply : "") +
          (b.caution ? "\n\n## 주의할 점\n" + b.caution : "") +
          (b.original ? "\n\n## 원문\n" + b.original : "")
        );
      case "flow":
        return (b.items || [])
          .map(function (it) {
            return "## " + it.label + "\n" + (it.text || "");
          })
          .join("\n\n");
      case "dodont":
        return (
          "## DO\n" +
          listToMd(b.doItems || [], false) +
          "\n\n## DON'T\n" +
          listToMd(b.dontItems || [], false)
        );
      case "image":
        if (!b.src) return "";
        return "![" + (b.alt || "") + "](" + b.src + ")";
      default:
        return b.text || "";
    }
  }

  function toMarkdown(project) {
    const m = project.meta || {};
    const fm = [
      "---",
      "title: " + (m.title || ""),
      "subtitle: " + (m.subtitle || ""),
      "category: " + (m.category || ""),
      "department: " + (m.department || ""),
      "date: " + (m.date || ""),
      "version: " + (m.version || ""),
      "---",
      ""
    ].join("\n");

    const parts = [fm];
    (project.pages || []).forEach(function (p) {
      if (p.type === "cover" || p.type === "toc") return;
      parts.push("<!-- page: " + p.type + " -->");
      if (p.type === "chapter") {
        parts.push("# CHAPTER " + (p.chapterNo || "") + " " + (p.title || ""));
      } else {
        parts.push("# " + (p.title || "제목 없음"));
      }
      if (p.subtitle) parts.push("\n" + p.subtitle);
      (p.blocks || []).forEach(function (b) {
        const md = blockToMd(b);
        if (md) parts.push("\n" + md);
      });
      parts.push("\n---\n");
    });
    return parts.join("\n").replace(/\n{3,}/g, "\n\n");
  }

  EB.Markdown = {
    parse: parse,
    toMarkdown: toMarkdown,
    tokenize: tokenize,
    blockWeight: blockWeight,
    tokenWeight: tokenWeight,
    classifySection: classifySection
  };
})(typeof window !== "undefined" ? window : global);
