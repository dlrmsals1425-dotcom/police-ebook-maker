/* 앱 진입 — 서버 없이 동작 */
(function () {
  const EB = window.EB;
  const $ = EB.$;

  const state = {
    project: null,
    currentId: null,
    preview: false,
    bound: false,
    pendingImgBlock: null,
    focusHint: null,
    report: null
  };

  function saveNow() {
    if (!state.project) return false;
    const ok = EB.Store.save(state.project);
    const el = $("#save-status");
    if (el) {
      el.textContent = ok ? "자동 저장 " + EB.nowTime() : "저장 실패 · JSON 백업 필요";
      el.classList.toggle("is-saved", ok);
      el.classList.toggle("is-error", !ok);
    }
    return ok;
  }

  const delayedSave = EB.debounce(saveNow, 500);
  function autosave() {
    const el = $("#save-status");
    if (el) {
      el.textContent = "저장 중…";
      el.classList.remove("is-saved", "is-error");
    }
    delayedSave();
  }

  function selectPanel(panel) {
    document.body.dataset.panel = panel;
    EB.$$("[data-panel]").forEach(function (btn) {
      if (btn.tagName === "BUTTON") btn.setAttribute("aria-pressed", String(btn.dataset.panel === panel));
    });
    requestAnimationFrame(EB.Render.fit);
  }

  function currentPage() {
    return EB.Editor.pageById(state.project, state.currentId);
  }

  function selectPage(id, opts) {
    if (!state.project) return;
    const exists = EB.Editor.pageById(state.project, id);
    if (!exists) id = state.project.pages[0].id;
    state.currentId = id;
    render(opts && opts.keepFocus);
  }

  function render(keepFocus) {
    if (!state.project) return;
    const project = state.project;
    const page = currentPage() || project.pages[0];
    state.currentId = page.id;
    const idx = EB.Editor.findPageIndex(project, page.id);
    const q = ($("#nav-search") && $("#nav-search").value) || "";

    state.report = EB.Lint.analyze(project);
    updateReviewChrome(page);

    const tree = $("#nav-tree");
    tree.innerHTML = "";
    tree.appendChild(EB.Render.nav(project, page.id, q, state.report));

    const mount = $("#page-mount");
    const active = document.activeElement;
    const restoreSel =
      keepFocus &&
      active &&
      mount.contains(active) &&
      active.getAttribute &&
      active.getAttribute("data-bind");
    let restoreKey = restoreSel
      ? [
          active.getAttribute("data-bind"),
          active.getAttribute("data-block-id") || "",
          active.getAttribute("data-field") || "",
          active.getAttribute("data-index") || "",
          active.getAttribute("data-gindex") || ""
        ].join("|")
      : null;
    if (state.focusHint) {
      const h = state.focusHint;
      restoreKey = [
        h.bind || "",
        h.blockId || "",
        h.field || "",
        h.index || "",
        h.gindex || ""
      ].join("|");
      state.focusHint = null;
    }

    mount.innerHTML = "";
    const el = EB.Render.page(project, page, {
      editable: !state.preview,
      pageIndex: idx,
      total: project.pages.length
    });
    mount.appendChild(el);

    $("#page-indicator").textContent = idx + 1 + " / " + project.pages.length;
    $("#btn-prev").disabled = idx === 0;
    $("#btn-next").disabled = idx === project.pages.length - 1;
    $("#document-title").textContent = project.meta.title || "제목 없는 전자책";
    $("#document-count").textContent = project.pages.length + "페이지";
    $("#inspector").innerHTML = EB.Editor.inspectorHtml(project, page);
    bindInspector();
    requestAnimationFrame(function () {
      EB.Render.fit();
      if (restoreKey) {
        const nodes = EB.$$("[data-bind]", mount);
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const key = [
            n.getAttribute("data-bind"),
            n.getAttribute("data-block-id") || "",
            n.getAttribute("data-field") || "",
            n.getAttribute("data-index") || "",
            n.getAttribute("data-gindex") || ""
          ].join("|");
          if (key === restoreKey) {
            n.focus();
            try {
              const range = document.createRange();
              range.selectNodeContents(n);
              range.collapse(false);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            } catch (e) {}
            break;
          }
        }
      }
    });
  }

  function onChange(kind, hint) {
    if (hint) state.focusHint = hint;
    autosave();
    if (kind === "structure" || kind === "meta" || kind === "page") render(kind !== "structure");
    else {
      const tree = $("#nav-tree");
      const page = currentPage();
      const q = ($("#nav-search") && $("#nav-search").value) || "";
      state.report = EB.Lint.analyze(state.project);
      updateReviewChrome(page);
      $("#document-title").textContent = state.project.meta.title || "제목 없는 전자책";
      tree.innerHTML = "";
      tree.appendChild(EB.Render.nav(state.project, page.id, q, state.report));
    }
  }

  function updateReviewChrome(page) {
    const report = state.report || { issues: [], byPage: {}, errorCount: 0, warnCount: 0 };
    const badge = $("#review-badge");
    const n = report.errorCount + report.warnCount;
    if (badge) {
      badge.hidden = n === 0;
      badge.textContent = String(n);
      badge.classList.toggle("is-ok", n === 0);
    }
    const bar = $("#issue-bar");
    if (!bar || !page) return;
    const mine = (report.byPage && report.byPage[page.id]) || [];
    const actionable = mine.filter(function (x) {
      return x.level !== "info";
    });
    if (!actionable.length) {
      bar.hidden = true;
      bar.textContent = "";
      return;
    }
    const err = actionable.some(function (x) {
      return x.level === "error";
    });
    bar.hidden = false;
    bar.classList.toggle("is-error", err);
    bar.textContent =
      "이 페이지에서 고칠 항목 " +
      actionable.length +
      "건 — " +
      actionable[0].message +
      (actionable.length > 1 ? " 외" : "") +
      "  ·  클릭하면 전체 목록";
  }

  function bindInspector() {
    const type = $("#ins-type");
    if (type) {
      type.addEventListener("change", function () {
        EB.Editor.changeType(currentPage(), type.value);
        onChange("structure");
      });
    }
    EB.$$("#ins-size [data-size]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const p = currentPage();
        p.titleSize = btn.getAttribute("data-size");
        onChange("structure");
      });
    });
    EB.$$("#ins-bg [data-bg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const p = currentPage();
        p.background = btn.getAttribute("data-bg");
        onChange("structure");
      });
    });
    const pnum = $("#ins-pnum");
    if (pnum) {
      pnum.addEventListener("change", function () {
        currentPage().showPageNumber = pnum.checked;
        onChange("structure");
      });
    }
    const sub = $("#ins-sub");
    if (sub) {
      sub.addEventListener("input", function () {
        currentPage().subtitle = sub.value;
        autosave();
      });
    }
    const chno = $("#ins-chno");
    if (chno) {
      chno.addEventListener("input", function () {
        currentPage().chapterNo = chno.value;
        onChange("page");
      });
    }
    EB.$$("[data-add-block]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const type = btn.getAttribute("data-add-block");
        if (type === "image") {
          const b = EB.Editor.addBlock(currentPage(), "image");
          state.pendingImgBlock = b;
          $("#file-img").click();
          onChange("structure");
          return;
        }
        EB.Editor.addBlock(currentPage(), type);
        onChange("structure");
      });
    });
  }

  function setPreview(on) {
    if (on === state.preview) return;
    const frame = $("#reader-frame");
    if (on) {
      saveNow();
      frame.srcdoc = EB.Export.htmlString(state.project, {
        startIndex: EB.Editor.findPageIndex(state.project, state.currentId),
        preview: true
      });
    } else {
      frame.removeAttribute("srcdoc");
    }
    state.preview = on;
    document.body.classList.toggle("is-preview", on);
    $("#reader-preview").hidden = !on;
    const btn = $("#btn-preview");
    if (btn) btn.textContent = on ? "미리보기 중" : "책장 넘김 미리보기";
    if (on) frame.focus();
    else {
      render();
      if (btn) btn.focus();
    }
  }

  function confirmReplace() {
    return window.confirm("현재 전자책을 바꾸고 새로 불러올까요? 기존 내용이 필요하면 취소 후 JSON 백업을 먼저 저장해 주세요.");
  }

  function loadProject(project, toastMsg) {
    state.project = EB.ensureProjectShape(project);
    state.currentId = state.project.pages[0].id;
    saveNow();
    EB.Store.markSeen();
    render();
    if (toastMsg) EB.toast(toastMsg);
  }

  function importMarkdown(text) {
    try {
      const project = EB.Markdown.parse(text);
      loadProject(project, "Markdown을 전자책으로 변환했습니다.");
      openReviewModal(true);
    } catch (e) {
      if (e && e.code === "EMPTY") {
        EB.toast("불러온 Markdown이 비어 있습니다.", true);
      } else {
        EB.toast("Markdown을 해석하지 못했습니다. UTF-8 텍스트인지 확인해 주세요.", true);
      }
    }
  }

  function openPromptModal() {
    const root = $("#modal-root");
    root.innerHTML =
      '<div class="modal-backdrop"><div class="modal" role="dialog" aria-labelledby="prompt-title">' +
      '<header><h3 id="prompt-title">마스터 프롬프트</h3>' +
      '<button type="button" class="btn" id="prompt-close">닫기</button></header>' +
      '<div class="body">' +
      '<div class="steps"><div class="step"><div class="n">1 자료 넣기</div><p>정리되지 않은 메모나 원문도 괜찮습니다. 아래에 붙여넣으세요.</p></div>' +
      '<div class="step"><div class="n">2 AI에 전달</div><p>입력한 자료가 포함된 프롬프트를 복사해 사용 가능한 AI에 전달합니다.</p></div>' +
      '<div class="step"><div class="n">3 책으로 읽기</div><p>AI의 Markdown을 불러오면 상황·판단·행동·자기점검 순서의 책으로 읽습니다.</p></div></div>' +
      '<p class="ins-help">필수는 원본자료뿐입니다. 지금 비워 두면 AI 대화에서 나중에 붙일 수 있습니다. 자료는 여기서 AI로 자동 전송되지 않으며, 아래 입력은 창을 닫으면 지워집니다.</p>' +
      '<div class="field"><label for="prompt-material">원본자료</label><textarea id="prompt-material" rows="7" placeholder="전달할 보고서·사례·지침·메모를 붙여넣으세요. 요건과 예외도 함께 넣어 주세요."></textarea></div>' +
      '<div class="field"><label for="prompt-goal">읽은 뒤 달라졌으면 하는 행동 · 선택</label><input id="prompt-goal" placeholder="예: 인계할 때 끝낸 일과 남은 일을 구분한다"></div>' +
      '<div class="field"><label for="prompt-audience">대상 직원 · 선택</label><select id="prompt-audience"><option>지구대·파출소 지역경찰</option><option>신규 전입·신임 지역경찰</option><option>현장 경험이 있는 지역경찰</option><option>팀장·선임과 함께 읽는 지역경찰</option></select></div>' +
      '<div class="field"><label for="prompt-kind">자료 성격 · 선택</label><select id="prompt-kind"><option>원문에 맞춰 자동 선택</option><option>반복 실수 예방</option><option>사례 복기</option><option>변경 지침</option><option>신규자 안내</option></select></div>' +
      '<div class="field"><label for="prompt-sources">출처·시행일·적용 범위·확인 담당 · 선택</label><textarea id="prompt-sources" rows="2" placeholder="아는 정보만 적으세요. 없는 날짜·조치 요건은 추정하지 않습니다."></textarea></div>' +
      '<p class="ins-help">승인된 AI에서 취급 가능한 자료만 사용하고 식별정보는 먼저 제거하세요. 가상 사례는 기본으로 만들지 않습니다. 복사 후 AI에 명시적으로 요청한 경우만 사용합니다. 결과물은 근거와 실제 화면·PDF를 확인한 뒤 배포하세요.</p>' +
      "</div>" +
      '<footer><button type="button" class="btn" id="prompt-copy">복사하기</button>' +
      '<button type="button" class="btn btn-primary" id="prompt-dl">파일로 저장</button></footer></div></div>';
    function close() {
      root.innerHTML = "";
    }
    $("#prompt-close").onclick = close;
    function preparedPrompt() {
      return EB.buildMasterPrompt({
        audience: $("#prompt-audience").value,
        goal: $("#prompt-goal").value.trim(),
        kind: $("#prompt-kind").value,
        sources: $("#prompt-sources").value.trim(),
        material: $("#prompt-material").value.trim()
      });
    }
    $("#prompt-dl").onclick = function () {
      EB.downloadText(EB.MASTER_PROMPT_FILENAME, preparedPrompt(), "text/markdown;charset=utf-8");
      EB.toast("마스터 프롬프트를 저장했습니다. AI 대화창에 붙여넣으세요.");
    };
    $("#prompt-copy").onclick = function () {
      EB.copyText(preparedPrompt()).then(
        function () {
          EB.toast("클립보드에 복사했습니다. AI 대화창에 붙여넣으세요.");
        },
        function () {
          EB.toast("복사에 실패했습니다. 파일로 저장해 주세요.", true);
        }
      );
    };
  }

  function openReviewModal(afterImport) {
    const report = (state.report = EB.Lint.analyze(state.project));
    const root = $("#modal-root");
    const total = state.project.pages.length;
    const action = report.errorCount + report.warnCount;
    let body;
    if (!action) {
      body =
        '<p>변환된 페이지 <strong>' +
        total +
        "쪽</strong>. 분량 경고가 없습니다. 화면에서 한번 훑어본 뒤 배포하면 됩니다.</p>";
    } else {
      body =
        "<p>" +
        (afterImport ? "전자책으로 변환했습니다. " : "") +
        total +
        "쪽 중 수정하면 좋은 항목 <strong>" +
        action +
        "건</strong>" +
        (report.errorCount ? " · 잘림 위험 " + report.errorCount + "건" : "") +
        "입니다. 항목을 누르면 해당 페이지로 이동합니다.</p>" +
        '<div class="review-list">' +
        report.issues
          .filter(function (x) {
            return x.level !== "info" || action < 8;
          })
          .map(function (x) {
            return (
              '<button type="button" class="review-item is-' +
              x.level +
              '" data-go="' +
              x.pageId +
              '"><div class="meta">' +
              (x.level === "error" ? "잘림 위험" : x.level === "warn" ? "수정 권고" : "안내") +
              " · " +
              (x.pageIndex + 1) +
              "쪽 · " +
              EB.escapeHtml(x.pageTitle) +
              '</div><div class="msg">' +
              EB.escapeHtml(x.message) +
              "</div>" +
              (x.fix ? '<div class="fix">' + EB.escapeHtml(x.fix) + "</div>" : "") +
              "</button>"
            );
          })
          .join("") +
        "</div>";
    }
    root.innerHTML =
      '<div class="modal-backdrop"><div class="modal" role="dialog" aria-labelledby="rev-title">' +
      '<header><h3 id="rev-title">검토</h3>' +
      '<button type="button" class="btn" id="rev-close">닫기</button></header>' +
      '<div class="body">' +
      body +
      "</div>" +
      '<footer><button type="button" class="btn btn-primary" id="rev-ok">확인</button></footer></div></div>';
    function close() {
      root.innerHTML = "";
    }
    $("#rev-close").onclick = close;
    $("#rev-ok").onclick = close;
    EB.$$("[data-go]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-go");
        close();
        selectPage(id);
      });
    });
  }

  function openMarkdownModal() {
    const root = $("#modal-root");
    root.innerHTML =
      '<div class="modal-backdrop" id="md-modal"><div class="modal" role="dialog" aria-labelledby="md-title">' +
      '<header><h3 id="md-title">Markdown 불러오기</h3>' +
      '<button type="button" class="btn" id="md-close">닫기</button></header>' +
      '<div class="body">' +
      '<div class="steps"><div class="step"><div class="n">1</div><p>마스터 프롬프트를 다른 AI에 넣고 원본자료를 붙여넣습니다.</p></div>' +
      '<div class="step"><div class="n">2</div><p>AI가 만든 Markdown을 아래에 넣거나 파일로 고릅니다.</p></div>' +
      '<div class="step"><div class="n">3</div><p>변환 후 검토 경고를 보고 긴 문장만 다듬습니다.</p></div></div>' +
      '<p class="ins-help">파일 선택 또는 붙여넣기. 브라우저 밖으로 전송되지 않습니다.</p>' +
      '<p><button type="button" class="btn" id="md-prompt">마스터 프롬프트 받기</button> ' +
      '<button type="button" class="btn btn-primary" id="md-file">파일 선택</button></p>' +
      '<textarea class="md-input" id="md-text" placeholder="# 제목\n\n> point: 핵심\n\n## 본문\n내용"></textarea></div>' +
      '<footer><button type="button" class="btn" id="md-cancel">취소</button>' +
      '<button type="button" class="btn btn-primary" id="md-go">전자책으로 변환</button></footer></div></div>';
    function close() {
      root.innerHTML = "";
    }
    $("#md-close").onclick = close;
    $("#md-cancel").onclick = close;
    $("#md-file").onclick = function () {
      $("#file-md").click();
    };
    $("#md-prompt").onclick = function () {
      close();
      openPromptModal();
    };
    $("#md-go").onclick = function () {
      const text = $("#md-text").value;
      close();
      if (state.project && state.project.pages.length && !confirmReplace()) return;
      importMarkdown(text);
    };
  }

  function openAddPageMenu(anchor) {
    const existing = document.getElementById("add-page-pop");
    if (existing) existing.remove();
    const pop = document.createElement("div");
    pop.id = "add-page-pop";
    pop.className = "dd-menu";
    pop.style.display = "block";
    pop.style.position = "absolute";
    pop.style.top = "52px";
    pop.style.left = anchor.getBoundingClientRect().left + "px";
    pop.style.zIndex = "40";
    pop.innerHTML = EB.PAGE_TYPES.filter(function (t) {
      return t.id !== "cover";
    })
      .map(function (t) {
        return '<button type="button" data-new-type="' + t.id + '">' + t.label + "</button>";
      })
      .join("");
    document.body.appendChild(pop);
    function close(ev) {
      if (ev && pop.contains(ev.target)) return;
      pop.remove();
      document.removeEventListener("click", close, true);
    }
    setTimeout(function () {
      document.addEventListener("click", close, true);
    }, 0);
    pop.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-new-type]");
      if (!btn) return;
      const p = EB.Editor.addPage(state.project, btn.getAttribute("data-new-type"), state.currentId);
      state.currentId = p.id;
      onChange("structure");
      EB.toast("페이지를 추가했습니다.");
      pop.remove();
      document.removeEventListener("click", close, true);
    });
  }

  function bindMountFacade() {
    const mount = $("#page-mount");
    if (mount.dataset.bound) return;
    mount.dataset.bound = "1";
    const facade = {};
    Object.defineProperty(facade, "meta", {
      get: function () {
        return state.project.meta;
      }
    });
    Object.defineProperty(facade, "pages", {
      get: function () {
        return state.project.pages;
      }
    });
    EB.Editor.bindMount(mount, facade, onChange);
  }

  function go(delta) {
    const i = EB.Editor.findPageIndex(state.project, state.currentId);
    const n = i + delta;
    if (n < 0 || n >= state.project.pages.length) return;
    selectPage(state.project.pages[n].id);
  }

  function bindUi() {
    $("#btn-new").addEventListener("click", function () {
      if (!confirmReplace()) return;
      loadProject(EB.createBlankProject(), "새 전자책을 만들었습니다. 표지부터 수정하세요.");
    });
    $("#btn-reset").addEventListener("click", function () {
      if (
        !window.confirm(
          "저장된 작업을 지우고 처음 상태(샘플 전자책)로 되돌릴까요? JSON 백업이 없으면 복구할 수 없습니다."
        )
      ) {
        return;
      }
      EB.Store.clear();
      loadProject(EB.buildSampleProject(), "처음 상태로 되돌렸습니다.");
    });
    $("#btn-prompt").addEventListener("click", openPromptModal);
    $("#btn-review").addEventListener("click", function () {
      openReviewModal(false);
    });
    const issueBar = $("#issue-bar");
    if (issueBar) {
      issueBar.addEventListener("click", function () {
        openReviewModal(false);
      });
    }
    $("#btn-md").addEventListener("click", openMarkdownModal);
    $("#btn-add-page").addEventListener("click", function (e) {
      openAddPageMenu(e.currentTarget);
    });
    $("#btn-dup-page").addEventListener("click", function () {
      const p = EB.Editor.duplicatePage(state.project, state.currentId);
      if (p) {
        state.currentId = p.id;
        onChange("structure");
        EB.toast("페이지를 복제했습니다.");
      }
    });
    $("#btn-del-page").addEventListener("click", function () {
      if (!window.confirm("이 페이지를 삭제할까요?")) return;
      const next = EB.Editor.deletePage(state.project, state.currentId);
      if (next >= 0 && state.project.pages[next]) {
        state.currentId = state.project.pages[next].id;
        onChange("structure");
      }
    });
    $("#btn-preview").addEventListener("click", function () {
      setPreview(!state.preview);
    });
    $("#btn-preview-exit").addEventListener("click", function () {
      setPreview(false);
    });
    $("#btn-pdf").addEventListener("click", function () {
      EB.Export.printPdf(state.project);
    });
    $("#btn-html").addEventListener("click", function () {
      EB.Export.html(state.project);
      EB.toast("전자책 HTML을 저장했습니다. 브라우저로 열면 책처럼 한 장씩 넘깁니다.");
    });
    $("#btn-md-out").addEventListener("click", function () {
      EB.Export.markdown(state.project);
      EB.toast("Markdown으로 내보냈습니다.");
    });
    $("#btn-json-out").addEventListener("click", function () {
      EB.Export.json(state.project);
      EB.toast("JSON 백업을 저장했습니다.");
    });
    $("#btn-json-in").addEventListener("click", function () {
      $("#file-json").click();
    });
    $("#btn-sample").addEventListener("click", function () {
      if (!confirmReplace()) return;
      loadProject(EB.buildSampleProject(), "샘플 전자책을 불러왔습니다.");
    });
    $("#btn-prev").addEventListener("click", function () {
      go(-1);
    });
    $("#btn-next").addEventListener("click", function () {
      go(1);
    });
    $("#btn-fit").addEventListener("click", function () {
      const wide = document.body.classList.toggle("fit-width");
      this.setAttribute("aria-pressed", String(wide));
      this.textContent = wide ? "한 쪽 맞춤" : "너비 맞춤";
      EB.Render.fit();
    });
    EB.$$("button[data-panel]").forEach(function (btn) {
      btn.addEventListener("click", function () { selectPanel(btn.dataset.panel); });
    });
    $("#nav-search").addEventListener("input", function () {
      render();
    });
    $("#nav-tree").addEventListener("click", function (e) {
      const item = e.target.closest(".nav-item");
      if (!item) return;
      selectPage(item.dataset.pageId);
      selectPanel("preview");
    });

    let dragId = null;
    $("#nav-tree").addEventListener("dragstart", function (e) {
      const item = e.target.closest(".nav-item");
      if (!item) return;
      dragId = item.dataset.pageId;
      e.dataTransfer.effectAllowed = "move";
    });
    $("#nav-tree").addEventListener("dragover", function (e) {
      e.preventDefault();
      const item = e.target.closest(".nav-item");
      EB.$$(".nav-item.is-dragover").forEach(function (n) {
        n.classList.remove("is-dragover");
      });
      if (item) item.classList.add("is-dragover");
    });
    $("#nav-tree").addEventListener("drop", function (e) {
      e.preventDefault();
      const item = e.target.closest(".nav-item");
      EB.$$(".nav-item.is-dragover").forEach(function (n) {
        n.classList.remove("is-dragover");
      });
      if (!item || !dragId) return;
      EB.Editor.movePage(state.project, dragId, item.dataset.pageId);
      dragId = null;
      onChange("structure");
    });

    function closeDropdowns() {
      document.querySelectorAll(".dd.open").forEach(function (d) {
        d.classList.remove("open");
        d.querySelector("[data-dd]").setAttribute("aria-expanded", "false");
      });
    }
    document.querySelectorAll("[data-dd]").forEach(function (btn) {
      const menu = document.getElementById(btn.getAttribute("data-dd")).querySelector(".dd-menu");
      menu.id = btn.getAttribute("data-dd") + "-menu";
      btn.setAttribute("aria-controls", menu.id);
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const id = btn.getAttribute("data-dd");
        const dropdown = document.getElementById(id);
        const wasOpen = dropdown.classList.contains("open");
        closeDropdowns();
        dropdown.classList.toggle("open", !wasOpen);
        btn.setAttribute("aria-expanded", String(!wasOpen));
      });
    });
    document.addEventListener("click", closeDropdowns);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      const open = document.querySelector(".dd.open [data-dd]");
      closeDropdowns();
      if (open) open.focus();
    });

    $("#file-md").addEventListener("change", function () {
      const file = this.files && this.files[0];
      this.value = "";
      if (!file) return;
      EB.readFileAsText(file)
        .then(function (text) {
          if (state.project && !confirmReplace()) return;
          importMarkdown(text);
        })
        .catch(function () {
          EB.toast("파일을 읽지 못했습니다. UTF-8 인지 확인해 주세요.", true);
        });
    });
    $("#file-json").addEventListener("change", function () {
      const file = this.files && this.files[0];
      this.value = "";
      if (!file) return;
      EB.readFileAsText(file)
        .then(function (text) {
          if (!confirmReplace()) return;
          loadProject(EB.Store.fromJSON(text), "백업을 불러왔습니다.");
        })
        .catch(function (err) {
          EB.toast(err.message || "백업 파일이 올바른 전자책 형식이 아닙니다.", true);
        });
    });
    $("#file-img").addEventListener("change", function () {
      const file = this.files && this.files[0];
      this.value = "";
      if (!file || !state.pendingImgBlock) return;
      EB.readFileAsDataURL(file)
        .then(function (url) {
          state.pendingImgBlock.src = url;
          state.pendingImgBlock.alt = file.name;
          state.pendingImgBlock = null;
          onChange("structure");
        })
        .catch(function () {
          EB.toast("이미지를 넣지 못했습니다.", true);
        });
    });

    const pane = $("#preview-pane");
    pane.addEventListener("dragover", function (e) {
      if (![].slice.call(e.dataTransfer.types).includes("Files")) return;
      e.preventDefault();
      pane.classList.add("is-dragover");
    });
    pane.addEventListener("dragleave", function () {
      pane.classList.remove("is-dragover");
    });
    pane.addEventListener("drop", function (e) {
      pane.classList.remove("is-dragover");
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      e.preventDefault();
      const name = (file.name || "").toLowerCase();
      if (/\.json$/.test(name)) {
        EB.readFileAsText(file).then(function (text) {
          if (!confirmReplace()) return;
          loadProject(EB.Store.fromJSON(text), "백업을 불러왔습니다.");
        }).catch(function (err) {
          EB.toast(err.message || "백업 파일을 읽지 못했습니다.", true);
        });
        return;
      }
      if (/\.(md|markdown|txt)$/.test(name) || file.type.indexOf("text") === 0) {
        EB.readFileAsText(file).then(function (text) {
          if (!confirmReplace()) return;
          importMarkdown(text);
        }).catch(function () {
          EB.toast("Markdown 파일을 읽지 못했습니다.", true);
        });
        return;
      }
      EB.toast("Markdown(.md) 또는 JSON 백업 파일을 올려 주세요.", true);
    });

    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (saveNow()) EB.toast("저장했습니다.");
        return;
      }
      if (state.preview) return;
      if ($("#modal-root").firstElementChild || document.querySelector(".dd.open")) return;
      const tag = (e.target && e.target.closest("[contenteditable], input, textarea, select"));
      if (tag) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        EB.Export.printPdf(state.project);
      }
    });

    window.addEventListener("resize", EB.debounce(EB.Render.fit, 80));
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") saveNow();
    });
    window.addEventListener("pagehide", saveNow);
    window.addEventListener("beforeprint", function () {
      if (state.project) EB.Export.preparePrint(state.project);
    });
  }

  function boot() {
    bindUi();
    bindMountFacade();
    const saved = EB.Store.load();
    if (saved && saved.pages && saved.pages.length) {
      loadProject(saved);
    } else {
      loadProject(EB.buildSampleProject());
    }
    const n = parseInt(new URLSearchParams(location.search).get("page") || "", 10);
    if (n >= 1 && n <= state.project.pages.length) {
      state.currentId = state.project.pages[n - 1].id;
      render();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
