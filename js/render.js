/* 페이지 렌더 — 편집/미리보기/인쇄 공통 */
(function (g) {
  const EB = (g.EB = g.EB || {});
  const H = EB.escapeHtml;

  function editableAttr(opts) {
    if (opts && opts.editable) return ' contenteditable="true" spellcheck="false"';
    return "";
  }

  function bind(kind, extra) {
    return ' data-bind="' + kind + '"' + (extra || "");
  }

  function tools(blockId) {
    return (
      '<div class="blk-tools" data-tools="' +
      blockId +
      '">' +
      '<button type="button" data-act="up" title="위로">▲</button>' +
      '<button type="button" data-act="down" title="아래로">▼</button>' +
      '<button type="button" data-act="del" title="삭제">×</button>' +
      "</div>"
    );
  }

  function ce(opts, blockId, field, text, extraCls) {
    return (
      '<div class="' +
      (extraCls || "") +
      '"' +
      bind("block") +
      ' data-block-id="' +
      blockId +
      '" data-field="' +
      field +
      '"' +
      editableAttr(opts) +
      ">" +
      H(text || "") +
      "</div>"
    );
  }

  function listEditor(opts, blockId, field, items, tag) {
    const t = tag || "ul";
    const cls = t === "ul" ? "bullets edit-list" : "edit-list";
    const html = (items || [""])
      .map(function (it, i) {
        const text = typeof it === "string" ? it : it.text || "";
        return (
          "<li" +
          bind("item") +
          ' data-block-id="' +
          blockId +
          '" data-field="' +
          field +
          '" data-index="' +
          i +
          '"' +
          editableAttr(opts) +
          ">" +
          H(text) +
          "</li>"
        );
      })
      .join("");
    return "<" + t + ' class="' + cls + '">' + html + "</" + t + ">";
  }

  function callout(opts, b, kind, label) {
    return (
      '<div class="blk callout is-' +
      kind +
      '" data-block-id="' +
      b.id +
      '">' +
      tools(b.id) +
      '<div class="side">' +
      label +
      "</div>" +
      ce(opts, b.id, "text", b.text, "body") +
      "</div>"
    );
  }

  function renderBlock(b, opts) {
    const wrapStart = '<div class="blk" data-block-id="' + b.id + '">' + tools(b.id);
    const wrapEnd = "</div>";
    switch (b.type) {
      case "heading":
        return (
          wrapStart +
          '<div class="h-block' +
          (b.level >= 3 ? " lv3" : "") +
          '"' +
          bind("block") +
          ' data-block-id="' +
          b.id +
          '" data-field="text"' +
          editableAttr(opts) +
          ">" +
          H(b.text || "") +
          "</div>" +
          wrapEnd
        );
      case "paragraph":
        return wrapStart + ce(opts, b.id, "text", b.text, "p-block") + wrapEnd;
      case "point":
        return (
          '<div class="blk point-bar" data-block-id="' +
          b.id +
          '">' +
          tools(b.id) +
          '<div class="tag">POINT</div>' +
          ce(opts, b.id, "text", b.text, "txt") +
          "</div>"
        );
      case "tip":
        return callout(opts, b, "tip", "TIP");
      case "warning":
        return callout(opts, b, "warning", "주의");
      case "example":
        return callout(opts, b, "example", "사례");
      case "quote":
        return wrapStart + ce(opts, b.id, "text", b.text, "quote-block") + wrapEnd;
      case "summary":
        return (
          '<div class="blk summary-ribbon" data-block-id="' +
          b.id +
          '">' +
          tools(b.id) +
          '<div class="tag">한줄 요약</div>' +
          ce(opts, b.id, "text", b.text, "txt") +
          "</div>"
        );
      case "bullets":
        return wrapStart + listEditor(opts, b.id, "items", b.items, "ul") + wrapEnd;
      case "learn":
        return (
          '<div class="blk learn-box" data-block-id="' +
          b.id +
          '">' +
          tools(b.id) +
          '<div class="learn-label">이 Chapter에서 배울 내용</div>' +
          '<div class="learn-items">' +
          (b.items || [])
            .map(function (t, i) {
              return (
                '<div class="learn-item"><span class="n">' +
                EB.pad2(i + 1) +
                "</span>" +
                '<span class="t"' +
                bind("item") +
                ' data-block-id="' +
                b.id +
                '" data-field="items" data-index="' +
                i +
                '"' +
                editableAttr(opts) +
                ">" +
                H(t) +
                "</span></div>"
              );
            })
            .join("") +
          "</div></div>"
        );
      case "checklist":
        return (
          wrapStart +
          (b.groups || [])
            .map(function (g, gi) {
              return (
                '<div class="check-group"><h3' +
                bind("group-title") +
                ' data-block-id="' +
                b.id +
                '" data-gindex="' +
                gi +
                '"' +
                editableAttr(opts) +
                ">" +
                H(g.title || "") +
                "</h3><ul>" +
                (g.items || [])
                  .map(function (it, ii) {
                    return (
                      '<li class="' +
                      (it.checked ? "is-checked" : "") +
                      '"><span class="box" data-act="check" data-block-id="' +
                      b.id +
                      '" data-gindex="' +
                      gi +
                      '" data-index="' +
                      ii +
                      '"></span><span' +
                      bind("check-item") +
                      ' data-block-id="' +
                      b.id +
                      '" data-gindex="' +
                      gi +
                      '" data-index="' +
                      ii +
                      '"' +
                      editableAttr(opts) +
                      ">" +
                      H(it.text || "") +
                      "</span></li>"
                    );
                  })
                  .join("") +
                "</ul></div>"
              );
            })
            .join("") +
          wrapEnd
        );
      case "flow":
        return (
          wrapStart +
          '<div class="flow">' +
          (b.items || [])
            .map(function (it, i) {
              return (
                '<div class="flow-step"><div class="flow-rail"><div class="flow-dot">' +
                (i + 1) +
                '</div></div><div class="flow-card"><div class="lab"' +
                bind("flow-label") +
                ' data-block-id="' +
                b.id +
                '" data-index="' +
                i +
                '"' +
                editableAttr(opts) +
                ">" +
                H(it.label || "") +
                '</div><div class="txt"' +
                bind("flow-text") +
                ' data-block-id="' +
                b.id +
                '" data-index="' +
                i +
                '"' +
                editableAttr(opts) +
                ">" +
                H(it.text || "") +
                "</div></div></div>"
              );
            })
            .join("") +
          "</div>" +
          wrapEnd
        );
      case "dodont":
        return (
          wrapStart +
          '<div class="dodont"><div class="col-do"><div class="col-head">DO · 해야 할 행동</div><div class="col-body">' +
          listEditor(opts, b.id, "doItems", b.doItems, "ul") +
          '</div></div><div class="col-dont"><div class="col-head">DON\'T · 하면 안 되는 행동</div><div class="col-body">' +
          listEditor(opts, b.id, "dontItems", b.dontItems, "ul") +
          "</div></div></div>" +
          wrapEnd
        );
      case "law":
        return (
          wrapStart +
          '<div class="law-card"><div class="law-name"' +
          bind("block") +
          ' data-block-id="' +
          b.id +
          '" data-field="title"' +
          editableAttr(opts) +
          ">" +
          H(b.title || "관련 법령") +
          '</div><div class="law-grid"><div class="law-cell"><div class="lab">핵심 내용</div>' +
          ce(opts, b.id, "text", b.text, "txt") +
          '</div><div class="law-cell"><div class="lab">현장에서는 이렇게 적용</div>' +
          ce(opts, b.id, "apply", b.apply, "txt") +
          '</div><div class="law-cell"><div class="lab">주의할 점</div>' +
          ce(opts, b.id, "caution", b.caution, "txt") +
          '</div></div><details class="law-original"' +
          (b.collapsed === false ? " open" : "") +
          '><summary>원문 펼치기</summary><div class="orig"' +
          bind("block") +
          ' data-block-id="' +
          b.id +
          '" data-field="original"' +
          editableAttr(opts) +
          ">" +
          H(b.original || "원문이 있으면 여기에 붙여 넣습니다.") +
          "</div></details></div>" +
          wrapEnd
        );
      case "image":
        return (
          wrapStart +
          '<div class="img-block">' +
          (b.src && /^(data:image\/|blob:)/i.test(b.src)
            ? '<img src="' + H(b.src) + '" alt="' + H(b.alt || "") + '">'
            : '<div class="img-ph">이미지를 오른쪽 설정에서 추가하세요</div>') +
          '<div class="cap"' +
          bind("block") +
          ' data-block-id="' +
          b.id +
          '" data-field="alt"' +
          editableAttr(opts) +
          ">" +
          H(b.alt || "설명") +
          "</div></div>" +
          wrapEnd
        );
      default:
        return wrapStart + ce(opts, b.id, "text", b.text, "p-block") + wrapEnd;
    }
  }

  function footer(project, page, opts) {
    if (page.showPageNumber === false) return "";
    const idx = (opts.pageIndex || 0) + 1;
    const total = opts.total || 1;
    const brand = H((project.meta && project.meta.category) || "내부 교육자료");
    return (
      '<div class="page-footer"><span class="brand-mini">' +
      brand +
      '</span><span class="pg-num">' +
      EB.pad2(idx) +
      " / " +
      EB.pad2(total) +
      "</span></div>"
    );
  }

  function bgClass(page) {
    if (page.background === "navy" || page.type === "cover" || page.type === "chapter") return " is-navy";
    if (page.background === "mist") return " is-mist";
    return "";
  }

  function renderCover(project, page, opts) {
    const m = project.meta;
    const ed = editableAttr(opts);
    return (
      '<article class="ebook-page is-cover" data-page-id="' +
      page.id +
      '">' +
      '<div class="cover-top">' +
      '<div class="cover-badge">INTERNAL TRAINING · HANDBOOK</div>' +
      '<svg class="cover-mark" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-width="2" d="M24 4 L42 12 V28 C42 36 33 42 24 45 C15 42 6 36 6 28 V12 Z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M16 22 L22 28 L33 16"/></svg>' +
      '<div class="cover-kicker"' +
      bind("meta") +
      ' data-field="category"' +
      ed +
      ">" +
      H(m.category || "내부 교육자료") +
      "</div>" +
      '<h1 class="cover-title"' +
      bind("meta") +
      ' data-field="title"' +
      ed +
      ">" +
      H(m.title || "") +
      "</h1>" +
      '<p class="cover-sub"' +
      bind("meta") +
      ' data-field="subtitle"' +
      ed +
      ">" +
      H(m.subtitle || "") +
      "</p></div>" +
      '<hr class="cover-rule">' +
      '<div class="cover-bottom">' +
      '<div class="meta-cell"><span class="k">제작부서</span><span class="v"' +
      bind("meta") +
      ' data-field="department"' +
      ed +
      ">" +
      H(m.department || "") +
      "</span></div>" +
      '<div class="meta-cell"><span class="k">제작일</span><span class="v"' +
      bind("meta") +
      ' data-field="date"' +
      ed +
      ">" +
      H(m.date || "") +
      "</span></div>" +
      '<div class="meta-cell"><span class="k">버전</span><span class="v"' +
      bind("meta") +
      ' data-field="version"' +
      ed +
      ">" +
      H(m.version || "") +
      "</span></div>" +
      '<div class="meta-cell"><span class="k">분류</span><span class="v">' +
      H(m.category || "") +
      "</span></div>" +
      "</div></article>"
    );
  }

  function tocData(project) {
    const rows = [];
    let ch = null;
    project.pages.forEach(function (p, i) {
      if (p.type === "cover" || p.type === "toc") return;
      if (p.type === "chapter") {
        ch = p;
        rows.push({ kind: "ch", page: p, index: i });
      } else {
        rows.push({ kind: "row", page: p, index: i, ch: ch });
      }
    });
    return rows;
  }

  function renderToc(project, page, opts) {
    const rows = tocData(project);
    const body = rows
      .map(function (r) {
        const num = EB.pad2(r.index + 1);
        if (r.kind === "ch") {
          return (
            '<div class="toc-ch"><span class="no">CHAPTER ' +
            H(r.page.chapterNo || "") +
            "</span><span>" +
            H(r.page.title) +
            "</span></div>"
          );
        }
        return (
          '<div class="toc-row"><span>' +
          H(r.page.title || "제목 없음") +
          '</span><span class="dots"></span><span class="num">' +
          num +
          "</span></div>"
        );
      })
      .join("");
    return (
      '<article class="ebook-page" data-page-id="' +
      page.id +
      '"><div class="page-inner"><div class="toc-head"><h1 class="pg-title">목차</h1><span class="kicker">CONTENTS</span></div><div class="toc-list">' +
      body +
      "</div></div>" +
      footer(project, page, opts) +
      "</article>"
    );
  }

  function renderChapter(project, page, opts) {
    const ed = editableAttr(opts);
    const blocks = (page.blocks || [])
      .map(function (b) {
        return renderBlock(b, opts);
      })
      .join("");
    return (
      '<article class="ebook-page chapter-page' +
      bgClass(page) +
      '" data-page-id="' +
      page.id +
      '"><div class="page-inner">' +
      '<div class="ch-index">CHAPTER</div>' +
      '<div class="ch-no"' +
      bind("page") +
      ' data-field="chapterNo"' +
      ed +
      ">" +
      H(page.chapterNo || "01") +
      "</div>" +
      '<h1 class="ch-title"' +
      bind("page") +
      ' data-field="title"' +
      ed +
      ">" +
      H(page.title || "") +
      "</h1>" +
      (page.subtitle
        ? '<p class="ch-sub"' +
          bind("page") +
          ' data-field="subtitle"' +
          ed +
          ">" +
          H(page.subtitle) +
          "</p>"
        : "") +
      blocks +
      "</div>" +
      footer(project, page, opts) +
      "</article>"
    );
  }

  function renderSummaryPage(project, page, opts) {
    const ed = editableAttr(opts);
    const bullet = (page.blocks || []).filter(function (b) {
      return b.type === "bullets";
    })[0];
    const others = (page.blocks || []).filter(function (b) {
      return b.type !== "bullets" && b.type !== "heading";
    });
    const items = (bullet && bullet.items) || [];
    const list = items
      .map(function (t, i) {
        return (
          '<div class="remember-item"><div class="n">' +
          EB.pad2(i + 1) +
          '</div><div class="t"' +
          (bullet
            ? bind("item") +
              ' data-block-id="' +
              bullet.id +
              '" data-field="items" data-index="' +
              i +
              '"' +
              ed
            : "") +
          ">" +
          H(t) +
          "</div></div>"
        );
      })
      .join("");
    return (
      '<article class="ebook-page" data-page-id="' +
      page.id +
      '"><div class="page-inner content-stack">' +
      '<div class="remember-head"><div class="remember-mark">5</div>' +
      '<div><div class="kicker">REMEMBER</div><h1 class="pg-title size-' +
      (page.titleSize || "md") +
      '"' +
      bind("page") +
      ' data-field="title"' +
      ed +
      ">" +
      H(page.title || "이것만은 기억하세요") +
      "</h1></div></div>" +
      '<div class="remember-list">' +
      list +
      "</div>" +
      others
        .map(function (b) {
          return renderBlock(b, opts);
        })
        .join("") +
      "</div>" +
      footer(project, page, opts) +
      "</article>"
    );
  }

  function renderGeneric(project, page, opts) {
    const ed = editableAttr(opts);
    const size = page.titleSize || "md";
    const inner = (page.blocks || [])
      .map(function (b) {
        return renderBlock(b, opts);
      })
      .join("");
    return (
      '<article class="ebook-page' +
      bgClass(page) +
      '" data-page-id="' +
      page.id +
      '"><div class="page-inner content-stack">' +
      '<div class="kicker">' +
      H(EB.pageTypeLabel(page.type)) +
      "</div>" +
      '<h1 class="pg-title size-' +
      size +
      '"' +
      bind("page") +
      ' data-field="title"' +
      ed +
      ">" +
      H(page.title || "") +
      "</h1>" +
      (page.subtitle
        ? '<p class="pg-sub"' +
          bind("page") +
          ' data-field="subtitle"' +
          ed +
          ">" +
          H(page.subtitle) +
          "</p>"
        : "") +
      inner +
      "</div>" +
      footer(project, page, opts) +
      "</article>"
    );
  }

  function renderPage(project, page, opts) {
    opts = opts || {};
    let html;
    switch (page.type) {
      case "cover":
        html = renderCover(project, page, opts);
        break;
      case "toc":
        html = renderToc(project, page, opts);
        break;
      case "chapter":
        html = renderChapter(project, page, opts);
        break;
      case "summary":
        html = renderSummaryPage(project, page, opts);
        break;
      default:
        html = renderGeneric(project, page, opts);
    }
    const box = document.createElement("div");
    box.innerHTML = html;
    return box.firstElementChild;
  }

  function renderNav(project, currentId, query, report) {
    const q = String(query || "").toLowerCase();
    const frag = document.createDocumentFragment();
    let inChapter = false;
    const byPage = (report && report.byPage) || {};
    project.pages.forEach(function (p, i) {
      const label = p.type === "cover" ? project.meta.title || "표지" : p.title || EB.pageTypeLabel(p.type);
      const chapterish = p.type === "chapter";
      const searchHit =
        !q ||
        label.toLowerCase().indexOf(q) !== -1 ||
        String(p.chapterNo).indexOf(q) !== -1;
      if (!searchHit) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "nav-item" +
        (p.id === currentId ? " is-active" : "") +
        (chapterish ? " is-chapter" : "") +
        (inChapter && !chapterish && p.type !== "cover" && p.type !== "toc" ? " is-child" : "");
      btn.dataset.pageId = p.id;
      btn.draggable = true;
      const flag = EB.Lint ? EB.Lint.worstLevel(byPage[p.id]) : "";
      btn.innerHTML =
        '<span class="idx">' +
        (p.type === "cover" ? "표지" : p.type === "toc" ? "목차" : EB.pad2(i + 1)) +
        '</span><span class="label">' +
        H(p.type === "chapter" ? "CH " + (p.chapterNo || "") + "  " + label : label) +
        "</span>" +
        (flag
          ? '<span class="nav-flag is-' +
            flag +
            '" title="수정할 항목이 있습니다"></span>'
          : "");
      frag.appendChild(btn);
      if (chapterish) inChapter = true;
      if (p.type === "cover" || p.type === "toc") inChapter = false;
    });
    return frag;
  }

  function fitStage() {
    const stage = document.getElementById("page-stage");
    const wrap = document.getElementById("page-scale-wrap");
    const page = wrap && wrap.querySelector(".ebook-page");
    if (!stage || !wrap || !page) return;
    page.style.transform = "none";
    wrap.style.width = "";
    wrap.style.height = "";
    const sw = stage.clientWidth - 36;
    const sh = stage.clientHeight - 16;
    const pw = page.offsetWidth || 1;
    const ph = page.offsetHeight || 1;
    const scale = Math.min(sw / pw, sh / ph, 1);
    wrap.style.width = Math.round(pw * scale) + "px";
    wrap.style.height = Math.round(ph * scale) + "px";
    page.style.transformOrigin = "top left";
    page.style.transform = "scale(" + scale + ")";
  }

  EB.Render = {
    page: renderPage,
    nav: renderNav,
    fit: fitStage,
    tocData: tocData,
    blockHtml: renderBlock
  };
})(window);
