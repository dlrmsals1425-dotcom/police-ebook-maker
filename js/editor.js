/* 인라인 편집 · 블록 · 페이지 조작 */
(function (g) {
  const EB = (g.EB = g.EB || {});

  function pageById(project, id) {
    for (let i = 0; i < project.pages.length; i++) {
      if (project.pages[i].id === id) return project.pages[i];
    }
    return null;
  }

  function blockById(page, id) {
    if (!page) return null;
    for (let i = 0; i < page.blocks.length; i++) {
      if (page.blocks[i].id === id) return page.blocks[i];
    }
    return null;
  }

  function findPageIndex(project, id) {
    for (let i = 0; i < project.pages.length; i++) {
      if (project.pages[i].id === id) return i;
    }
    return -1;
  }

  EB.Editor = {
    pageById: pageById,
    findPageIndex: findPageIndex,

    bindMount: function (root, project, onChange) {
      if (!root) return;
      let composing = false;

      function syncField(el) {
        const bind = el.getAttribute("data-bind");
        const text = el.innerText.replace(/\u00a0/g, " ").replace(/\n+$/, "");
        if (bind === "meta") {
          const field = el.getAttribute("data-field");
          project.meta[field] = text;
          if (field === "title") {
            const cover = project.pages.filter(function (p) {
              return p.type === "cover";
            })[0];
            if (cover) cover.title = text;
          }
          // Keep the live contenteditable and its selection intact while typing.
          onChange("text");
          return;
        }
        if (bind === "page") {
          const pageEl = el.closest("[data-page-id]");
          const page = pageById(project, pageEl && pageEl.getAttribute("data-page-id"));
          if (!page) return;
          page[el.getAttribute("data-field")] = text;
          onChange("text");
          return;
        }
        const bid = el.getAttribute("data-block-id");
        const pageEl = el.closest("[data-page-id]");
        const page = pageById(project, pageEl && pageEl.getAttribute("data-page-id"));
        const block = blockById(page, bid);
        if (!block) return;
        if (bind === "block") {
          block[el.getAttribute("data-field")] = text;
        } else if (bind === "item") {
          const field = el.getAttribute("data-field");
          const idx = Number(el.getAttribute("data-index"));
          if (!block[field]) block[field] = [];
          if (typeof block[field][idx] === "object") block[field][idx].text = text;
          else block[field][idx] = text;
        } else if (bind === "group-title") {
          const gi = Number(el.getAttribute("data-gindex"));
          if (block.groups && block.groups[gi]) block.groups[gi].title = text;
        } else if (bind === "check-item") {
          const gi = Number(el.getAttribute("data-gindex"));
          const ii = Number(el.getAttribute("data-index"));
          if (block.groups && block.groups[gi] && block.groups[gi].items[ii]) {
            block.groups[gi].items[ii].text = text;
          }
        } else if (bind === "flow-label") {
          const idx = Number(el.getAttribute("data-index"));
          if (block.items && block.items[idx]) block.items[idx].label = text;
        } else if (bind === "flow-text") {
          const idx = Number(el.getAttribute("data-index"));
          if (block.items && block.items[idx]) block.items[idx].text = text;
        }
        onChange("block");
      }

      root.addEventListener("paste", function (e) {
        const el = e.target.closest("[data-bind]");
        if (!el) return;
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text/plain");
        document.execCommand("insertText", false, text);
      });

      root.addEventListener("compositionstart", function () {
        composing = true;
      });
      root.addEventListener("compositionend", function (e) {
        composing = false;
        const el = e.target.closest("[data-bind]");
        if (el && root.contains(el)) syncField(el);
      });

      root.addEventListener("input", function (e) {
        if (composing || e.isComposing) return;
        const el = e.target.closest("[data-bind]");
        if (!el) return;
        syncField(el);
      });

      root.addEventListener("keydown", function (e) {
        // Enter/Backspace may belong to the IME, not to list editing.
        if (composing || e.isComposing || e.keyCode === 229) return;
        const el = e.target.closest("[data-bind]");
        if (!el) return;
        if (e.key === "Enter" && (el.getAttribute("data-bind") === "item" || el.getAttribute("data-bind") === "check-item")) {
          e.preventDefault();
          const pageEl = el.closest("[data-page-id]");
          const page = pageById(project, pageEl && pageEl.getAttribute("data-page-id"));
          const block = blockById(page, el.getAttribute("data-block-id"));
          if (!block) return;
          if (el.getAttribute("data-bind") === "item") {
            const field = el.getAttribute("data-field");
            const idx = Number(el.getAttribute("data-index"));
            const arr = block[field] || [];
            const sample = arr[idx];
            const neu = typeof sample === "object" ? { text: "", checked: false } : "";
            arr.splice(idx + 1, 0, neu);
            block[field] = arr;
            onChange("structure", {
              bind: "item",
              blockId: block.id,
              field: field,
              index: String(idx + 1)
            });
            return;
          } else {
            const gi = Number(el.getAttribute("data-gindex"));
            const ii = Number(el.getAttribute("data-index"));
            block.groups[gi].items.splice(ii + 1, 0, { text: "", checked: false });
            onChange("structure", {
              bind: "check-item",
              blockId: block.id,
              gindex: String(gi),
              index: String(ii + 1)
            });
            return;
          }
        }
        if (e.key === "Backspace" && el.innerText.trim() === "" && el.getAttribute("data-bind") === "item") {
          const pageEl = el.closest("[data-page-id]");
          const page = pageById(project, pageEl && pageEl.getAttribute("data-page-id"));
          const block = blockById(page, el.getAttribute("data-block-id"));
          const field = el.getAttribute("data-field");
          const idx = Number(el.getAttribute("data-index"));
          if (block && block[field] && block[field].length > 1) {
            e.preventDefault();
            block[field].splice(idx, 1);
            onChange("structure");
          }
        }
      });

      root.addEventListener("click", function (e) {
        const check = e.target.closest("[data-act='check']");
        if (check) {
          const pageEl = check.closest("[data-page-id]");
          const page = pageById(project, pageEl && pageEl.getAttribute("data-page-id"));
          const block = blockById(page, check.getAttribute("data-block-id"));
          const gi = Number(check.getAttribute("data-gindex"));
          const ii = Number(check.getAttribute("data-index"));
          if (block && block.groups && block.groups[gi] && block.groups[gi].items[ii]) {
            block.groups[gi].items[ii].checked = !block.groups[gi].items[ii].checked;
            onChange("structure");
          }
          return;
        }
        const btn = e.target.closest(".blk-tools button");
        if (!btn) return;
        const tools = btn.closest(".blk-tools");
        const bid = tools.getAttribute("data-tools");
        const pageEl = btn.closest("[data-page-id]");
        const page = pageById(project, pageEl && pageEl.getAttribute("data-page-id"));
        if (!page) return;
        const idx = page.blocks.findIndex(function (b) {
          return b.id === bid;
        });
        if (idx < 0) return;
        const act = btn.getAttribute("data-act");
        if (act === "del") {
          page.blocks.splice(idx, 1);
        } else if (act === "up" && idx > 0) {
          const t = page.blocks[idx - 1];
          page.blocks[idx - 1] = page.blocks[idx];
          page.blocks[idx] = t;
        } else if (act === "down" && idx < page.blocks.length - 1) {
          const t = page.blocks[idx + 1];
          page.blocks[idx + 1] = page.blocks[idx];
          page.blocks[idx] = t;
        }
        onChange("structure");
      });
    },

    addBlock: function (page, type) {
      if (!page) return;
      if (page.type === "cover" || page.type === "toc") {
        EB.toast("이 페이지에는 블록을 넣을 수 없습니다.", true);
        return;
      }
      const b = EB.createBlock(type);
      if (type === "heading") b.text = "중간 제목";
      if (type === "paragraph") b.text = "내용을 입력하세요.";
      if (type === "point") b.text = "핵심을 한두 문장으로 적습니다.";
      if (type === "summary") b.text = "이 페이지에서 기억할 한 줄.";
      if (type === "tip") b.text = "현장 팁을 적습니다.";
      if (type === "warning") b.text = "주의할 점을 적습니다.";
      page.blocks.push(b);
      return b;
    },

    addPage: function (project, type, afterId) {
      const p = EB.createPage(type, EB.pageTypeLabel(type));
      if (type === "chapter") {
        const n =
          project.pages.filter(function (x) {
            return x.type === "chapter";
          }).length + 1;
        p.chapterNo = EB.pad2(n);
        p.title = "새 Chapter";
        p.background = "navy";
      }
      p.blocks = EB.defaultBlocksFor(type);
      let idx = findPageIndex(project, afterId);
      if (idx < 0) idx = project.pages.length - 1;
      project.pages.splice(idx + 1, 0, p);
      return p;
    },

    duplicatePage: function (project, id) {
      const idx = findPageIndex(project, id);
      if (idx < 0) return null;
      const copy = EB.clone(project.pages[idx]);
      copy.id = EB.uid("page");
      copy.title = (copy.title || "") + " 복사";
      (copy.blocks || []).forEach(function (b) {
        b.id = EB.uid("blk");
      });
      project.pages.splice(idx + 1, 0, copy);
      return copy;
    },

    deletePage: function (project, id) {
      const idx = findPageIndex(project, id);
      if (idx < 0) return -1;
      const p = project.pages[idx];
      if (p.type === "cover") {
        EB.toast("표지는 삭제할 수 없습니다.", true);
        return idx;
      }
      if (project.pages.length <= 1) {
        EB.toast("페이지가 하나뿐이면 삭제할 수 없습니다.", true);
        return idx;
      }
      project.pages.splice(idx, 1);
      return Math.min(idx, project.pages.length - 1);
    },

    movePage: function (project, fromId, toId) {
      const from = findPageIndex(project, fromId);
      const to = findPageIndex(project, toId);
      if (from < 0 || to < 0 || from === to) return;
      const item = project.pages.splice(from, 1)[0];
      const newTo = findPageIndex(project, toId);
      if (newTo < 0) project.pages.push(item);
      else project.pages.splice(newTo, 0, item);
    },

    changeType: function (page, type) {
      if (!page) return;
      if (page.type === "cover" && type !== "cover") {
        EB.toast("표지 유형은 바꾸지 않는 것이 좋습니다.");
      }
      page.type = type;
      page.background = type === "cover" || type === "chapter" ? "navy" : "white";
      if (!page.blocks.length) page.blocks = EB.defaultBlocksFor(type);
    },

    inspectorHtml: function (project, page) {
      if (!page) return "<p class='ins-help'>페이지를 선택하세요.</p>";
      const types = EB.PAGE_TYPES.map(function (t) {
        return (
          '<option value="' +
          t.id +
          '"' +
          (page.type === t.id ? " selected" : "") +
          ">" +
          t.label +
          "</option>"
        );
      }).join("");
      const addBtns = EB.BLOCK_TYPES.map(function (t) {
        return '<button type="button" data-add-block="' + t.id + '">' + t.label + "</button>";
      }).join("");
      const pageIssues =
        EB.Lint && project
          ? EB.Lint.analyzePage(project, page, 0)
          : [];
      const issueHtml = pageIssues.length
        ? '<div class="issue-box">' +
          pageIssues
            .map(function (x) {
              return (
                '<div class="issue-row is-' +
                x.level +
                '"><strong>' +
                (x.level === "error" ? "잘림 위험" : x.level === "warn" ? "수정 권고" : "안내") +
                "</strong><span>" +
                EB.escapeHtml(x.message) +
                "</span>" +
                (x.fix ? "<em>" + EB.escapeHtml(x.fix) + "</em>" : "") +
                "</div>"
              );
            })
            .join("") +
          "</div>"
        : "";
      const locked = page.type === "cover" || page.type === "toc";
      return (
        '<div class="ins-section"><p class="ins-help">페이지를 클릭해 글을 바로 고칠 수 있습니다.</p>' +
        issueHtml +
        '<div class="field"><label>페이지 유형</label><select id="ins-type">' +
        types +
        "</select></div>" +
        '<div class="field"><label>제목 크기</label><div class="seg" id="ins-size">' +
        '<button type="button" data-size="sm"' +
        (page.titleSize === "sm" ? ' class="is-on"' : "") +
        ">작게</button>" +
        '<button type="button" data-size="md"' +
        (page.titleSize !== "sm" && page.titleSize !== "lg" ? ' class="is-on"' : "") +
        ">보통</button>" +
        '<button type="button" data-size="lg"' +
        (page.titleSize === "lg" ? ' class="is-on"' : "") +
        ">크게</button></div></div>" +
        '<div class="field"><label>배경</label><div class="seg" id="ins-bg">' +
        '<button type="button" data-bg="white"' +
        (page.background === "white" ? ' class="is-on"' : "") +
        ">흰색</button>" +
        '<button type="button" data-bg="mist"' +
        (page.background === "mist" ? ' class="is-on"' : "") +
        ">연회색</button>" +
        '<button type="button" data-bg="navy"' +
        (page.background === "navy" ? ' class="is-on"' : "") +
        ">네이비</button></div></div>" +
        '<label class="chk"><input type="checkbox" id="ins-pnum"' +
        (page.showPageNumber !== false ? " checked" : "") +
        "> 페이지 번호 표시</label></div>" +
        (locked
          ? '<div class="ins-section"><p class="ins-help">표지와 목차는 왼쪽 제목·정보를 직접 수정합니다. 목차는 페이지 목록에서 자동으로 만들어집니다.</p></div>'
          : '<div class="ins-section"><h2 class="pane-head" style="position:static;padding:0 0 8px;border:0">블록 추가</h2>' +
            '<div class="block-add-grid">' +
            addBtns +
            "</div></div>") +
        '<div class="ins-section"><div class="field"><label>부제</label>' +
        '<input id="ins-sub" value="' +
        EB.escapeHtml(page.subtitle || "") +
        '"></div>' +
        (page.type === "chapter"
          ? '<div class="field"><label>Chapter 번호</label><input id="ins-chno" value="' +
            EB.escapeHtml(page.chapterNo || "") +
            '"></div>'
          : "") +
        "</div>"
      );
    }
  };
})(window);
